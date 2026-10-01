// SymNexus Team sign-in, following the spark-admin model: credentials live in
// an environment variable, an email + password form posts to a server action,
// and the session is an httpOnly cookie checked on the server.
//
// Two changes from spark-admin, both required for a multi-person workspace:
//   - TEAM_ACCOUNTS holds one entry per employee (spark-admin had a single
//     ADMIN_EMAIL / ADMIN_PASSWORD), with scrypt password hashes, not plaintext.
//   - The cookie is signed (HMAC-SHA256 with SESSION_SECRET) and names the
//     account. spark-admin's cookie held a fixed string, which anyone could set
//     by hand to be signed in.
//
// No database is involved: removing an account from TEAM_ACCOUNTS, or changing
// its password, invalidates its sessions on the next request.

import { createHash, createHmac, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';

export const SESSION_COOKIE = 'symnexus_team_session';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days, as in spark-admin

export type Role = 'admin' | 'member';

export interface Account {
  email: string;
  name: string;
  role: Role;
  password: string; // scrypt$N$r$p$salt$hash
}

export interface Session {
  email: string;
  name: string;
  role: Role;
}

// ── Accounts ────────────────────────────────────────────────────────────────

let cache: { raw: string; accounts: Map<string, Account> } | null = null;

export function loadAccounts(raw = process.env.TEAM_ACCOUNTS ?? '[]'): Map<string, Account> {
  if (cache?.raw === raw) return cache.accounts;
  const accounts = new Map<string, Account>();
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('TEAM_ACCOUNTS is not valid JSON');
  }
  if (!Array.isArray(parsed)) throw new Error('TEAM_ACCOUNTS must be a JSON array');
  for (const entry of parsed as Partial<Account>[]) {
    const email = String(entry.email ?? '').trim().toLowerCase();
    if (!email || typeof entry.password !== 'string' || !entry.password.startsWith('scrypt$')) {
      throw new Error(`TEAM_ACCOUNTS has an invalid entry${email ? ` for ${email}` : ''}`);
    }
    accounts.set(email, {
      email,
      name: String(entry.name ?? email).trim() || email,
      role: entry.role === 'admin' ? 'admin' : 'member',
      password: entry.password,
    });
  }
  cache = { raw, accounts };
  return accounts;
}

// ── Passwords (scrypt) ─────────────────────────────────────────────────────

const N = 2 ** 15;
const R = 8;
const P = 1;
const KEY_LEN = 64;
export const MIN_PASSWORD_LENGTH = 12;

function derive(password: string, salt: Buffer, n: number, r: number, p: number): Promise<Buffer> {
  return new Promise((resolve, reject) =>
    scrypt(password.normalize('NFKC'), salt, KEY_LEN, { N: n, r, p, maxmem: 256 * n * r }, (err, key) =>
      err ? reject(err) : resolve(key),
    ),
  );
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await derive(password, salt, N, R, P);
  return ['scrypt', N, R, P, salt.toString('base64url'), key.toString('base64url')].join('$');
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt' || password.length > 256) return false;
  const [, n, r, p, salt, hash] = parts;
  const expected = Buffer.from(hash, 'base64url');
  const key = await derive(password, Buffer.from(salt, 'base64url'), Number(n), Number(r), Number(p));
  return key.length === expected.length && timingSafeEqual(key, expected);
}

// Checked when an email has no account, so a missing account takes as long as
// a wrong password and timing does not reveal which emails exist.
let dummyHash: Promise<string> | null = null;
async function burnTime(password: string) {
  dummyHash ??= hashPassword(randomBytes(18).toString('base64url'));
  await verifyPassword(password, await dummyHash);
}

// ── Sign-in throttle ───────────────────────────────────────────────────────
// Per function instance. Add a Vercel Firewall rate-limit rule on POST /login
// for a limit shared across instances.

const failures = new Map<string, { count: number; resetAt: number }>();
const MAX_FAILURES = 8;
const WINDOW_MS = 15 * 60_000;

function isThrottled(key: string): boolean {
  const f = failures.get(key);
  if (!f || f.resetAt <= Date.now()) return false;
  return f.count >= MAX_FAILURES;
}

function recordFailure(key: string) {
  const now = Date.now();
  const f = failures.get(key);
  if (!f || f.resetAt <= now) failures.set(key, { count: 1, resetAt: now + WINDOW_MS });
  else f.count++;
  if (failures.size > 10_000) for (const [k, v] of failures) if (v.resetAt <= now) failures.delete(k);
}

export type SignInResult = { ok: true; account: Account } | { ok: false; error: string };

export async function signIn(emailInput: string, password: string, clientKey: string): Promise<SignInResult> {
  const email = emailInput.trim().toLowerCase();
  if (isThrottled(`email:${email}`) || isThrottled(`ip:${clientKey}`)) {
    return { ok: false, error: 'Too many sign-in attempts. Try again in 15 minutes.' };
  }
  const account = loadAccounts().get(email);
  const valid = account ? await verifyPassword(password, account.password) : (await burnTime(password), false);
  if (!account || !valid) {
    recordFailure(`email:${email}`);
    recordFailure(`ip:${clientKey}`);
    return { ok: false, error: 'Invalid email or password.' };
  }
  failures.delete(`email:${email}`);
  return { ok: true, account };
}

// ── Signed session cookie ──────────────────────────────────────────────────

function secret(): Buffer {
  const s = process.env.SESSION_SECRET ?? '';
  if (s.length < 32) throw new Error('SESSION_SECRET must be set to at least 32 characters');
  return Buffer.from(s);
}

// Ties a session to the password it was created with: a password change or
// reset makes every older session invalid.
function passwordVersion(account: Account): string {
  return createHash('sha256').update(account.password).digest('base64url').slice(0, 16);
}

function sign(payload: string): string {
  return createHmac('sha256', secret()).update(payload).digest('base64url');
}

export function createSessionValue(account: Account, now = Date.now()): string {
  const payload = Buffer.from(
    JSON.stringify({ e: account.email, v: passwordVersion(account), x: Math.floor(now / 1000) + SESSION_MAX_AGE }),
  ).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function readSession(value: string | undefined, now = Date.now()): Session | null {
  if (!value || value.length > 1024) return null;
  const dot = value.indexOf('.');
  if (dot < 1) return null;
  const payload = value.slice(0, dot);
  const given = Buffer.from(value.slice(dot + 1));
  const expected = Buffer.from(sign(payload));
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;

  let data: { e?: string; v?: string; x?: number };
  try {
    data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
  if (typeof data.x !== 'number' || data.x * 1000 <= now) return null;
  const account = data.e ? loadAccounts().get(data.e) : undefined;
  if (!account || data.v !== passwordVersion(account)) return null;
  return { email: account.email, name: account.name, role: account.role };
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: SESSION_MAX_AGE,
  path: '/',
};
