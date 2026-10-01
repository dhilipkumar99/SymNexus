// SymNexus Team sign-in. Built on the spark-admin model: an email + password
// form posts to a server action, and the session is an httpOnly cookie checked
// on the server. Accounts live in Postgres (team_auth schema) so the master
// admin and admins can manage them from the app.
//
// The cookie names the account and its session version, expires, and is signed
// (HMAC-SHA256, SESSION_SECRET). Bumping an account's session_version (password
// reset, deactivation, "sign out everywhere") invalidates every older cookie.

import { createHash, createHmac, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { db } from './db.ts';

export const SESSION_COOKIE = 'symnexus_team_session';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days, as in spark-admin

import type { Role, Session } from './roles.ts';
export { ROLE_LABEL, type Role, type Session } from './roles.ts';

export interface AccountRow {
  id: string;
  email: string;
  name: string;
  role: Role;
  password_hash: string | null;
  session_version: number;
  active: boolean;
  created_at: Date;
  last_login_at: Date | null;
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

export function validatePassword(password: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) return `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
  if (password.length > 256) return 'Use at most 256 characters.';
  return null;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await derive(password, salt, N, R, P);
  return ['scrypt', N, R, P, salt.toString('base64url'), key.toString('base64url')].join('$');
}

export async function verifyPassword(password: string, stored: string | null): Promise<boolean> {
  const parts = (stored ?? '').split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt' || password.length > 256) return false;
  const [, n, r, p, salt, hash] = parts;
  const expected = Buffer.from(hash, 'base64url');
  const key = await derive(password, Buffer.from(salt, 'base64url'), Number(n), Number(r), Number(p));
  return key.length === expected.length && timingSafeEqual(key, expected);
}

// Spent when an email has no usable account, so a missing account takes as long
// as a wrong password and timing does not reveal which emails exist.
let dummyHash: Promise<string> | null = null;
async function burnTime(password: string) {
  dummyHash ??= hashPassword(randomBytes(18).toString('base64url'));
  await verifyPassword(password, await dummyHash);
}

// ── Sign-in throttle (shared across instances, in Postgres) ────────────────

const MAX_FAILURES = 8;
const WINDOW_SECONDS = 15 * 60;

async function throttled(keys: string[]): Promise<boolean> {
  const { rows } = await (await db()).query(
    'SELECT 1 FROM team_auth.throttle WHERE key = ANY($1) AND reset_at > now() AND failures >= $2 LIMIT 1',
    [keys, MAX_FAILURES],
  );
  return rows.length > 0;
}

async function recordFailure(keys: string[]) {
  const pool = await db();
  for (const key of keys) {
    await pool.query(
      `INSERT INTO team_auth.throttle (key, failures, reset_at)
       VALUES ($1, 1, now() + make_interval(secs => $2))
       ON CONFLICT (key) DO UPDATE SET
         failures = CASE WHEN team_auth.throttle.reset_at <= now() THEN 1 ELSE team_auth.throttle.failures + 1 END,
         reset_at = CASE WHEN team_auth.throttle.reset_at <= now() THEN now() + make_interval(secs => $2) ELSE team_auth.throttle.reset_at END`,
      [key, WINDOW_SECONDS],
    );
  }
  if (Math.random() < 0.02) await pool.query('DELETE FROM team_auth.throttle WHERE reset_at < now()');
}

export type SignInResult = { ok: true; account: AccountRow } | { ok: false; error: string };

export async function signIn(emailInput: string, password: string, ip: string): Promise<SignInResult> {
  const email = emailInput.trim().toLowerCase();
  const keys = [`email:${email}`, `ip:${ip}`];
  if (await throttled(keys)) return { ok: false, error: 'Too many sign-in attempts. Try again in 15 minutes.' };

  const pool = await db();
  const { rows } = await pool.query<AccountRow>('SELECT * FROM team_auth.accounts WHERE email = $1', [email]);
  const account = rows[0];
  const valid = account?.password_hash ? await verifyPassword(password, account.password_hash) : (await burnTime(password), false);
  if (!account || !valid || !account.active) {
    await recordFailure(keys);
    return { ok: false, error: 'Invalid email or password.' };
  }
  await pool.query('DELETE FROM team_auth.throttle WHERE key = $1', [`email:${email}`]);
  await pool.query('UPDATE team_auth.accounts SET last_login_at = now() WHERE id = $1', [account.id]);
  return { ok: true, account };
}

// ── Signed session cookie ──────────────────────────────────────────────────

function secret(): Buffer {
  const s = process.env.SESSION_SECRET ?? '';
  if (s.length < 32) throw new Error('SESSION_SECRET must be set to at least 32 characters');
  return Buffer.from(s);
}

function sign(payload: string): string {
  return createHmac('sha256', secret()).update(payload).digest('base64url');
}

export function createSessionValue(account: Pick<AccountRow, 'id' | 'session_version'>, now = Date.now()): string {
  const payload = Buffer.from(
    JSON.stringify({ i: account.id, v: account.session_version, x: Math.floor(now / 1000) + SESSION_MAX_AGE }),
  ).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

// Signature and expiry only, no database: used by proxy.ts to decide whether to
// serve the app shell. Everything that returns data calls readSession().
export function verifySessionCookie(value: string | undefined, now = Date.now()): { id: string; v: number } | null {
  if (!value || value.length > 1024) return null;
  const dot = value.indexOf('.');
  if (dot < 1) return null;
  const payload = value.slice(0, dot);
  const given = Buffer.from(value.slice(dot + 1));
  const expected = Buffer.from(sign(payload));
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (typeof data.i !== 'string' || typeof data.v !== 'number' || typeof data.x !== 'number') return null;
    if (data.x * 1000 <= now) return null;
    return { id: data.i, v: data.v };
  } catch {
    return null;
  }
}

// Resolved sessions are cached for a few seconds per instance, so a burst of
// API calls costs one query. Revocations apply within that window.
const sessionCache = new Map<string, { session: Session | null; until: number }>();
const SESSION_CACHE_MS = 5_000;

export function forgetCachedSessions() {
  sessionCache.clear();
}

export async function readSession(value: string | undefined): Promise<Session | null> {
  const claim = verifySessionCookie(value);
  if (!claim) return null;
  const key = `${claim.id}:${claim.v}`;
  const hit = sessionCache.get(key);
  if (hit && hit.until > Date.now()) return hit.session;

  const { rows } = await (await db()).query<AccountRow>(
    'SELECT id, email, name, role, session_version, active FROM team_auth.accounts WHERE id = $1',
    [claim.id],
  );
  const a = rows[0];
  const session = a && a.active && a.session_version === claim.v ? { id: a.id, email: a.email, name: a.name, role: a.role } : null;
  sessionCache.set(key, { session, until: Date.now() + SESSION_CACHE_MS });
  if (sessionCache.size > 5000) sessionCache.clear();
  return session;
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: SESSION_MAX_AGE,
  path: '/',
};

// ── Single-use password links (invitations and resets) ────────────────────

export const INVITE_TTL_HOURS = 7 * 24;
export const RESET_TTL_HOURS = 24;

const tokenHash = (token: string) => createHash('sha256').update(token).digest();

export async function createPasswordLink(accountId: string, purpose: 'invite' | 'reset'): Promise<string> {
  const token = randomBytes(32).toString('base64url');
  const hours = purpose === 'invite' ? INVITE_TTL_HOURS : RESET_TTL_HOURS;
  const pool = await db();
  await pool.query('DELETE FROM team_auth.password_links WHERE account_id = $1', [accountId]);
  await pool.query(
    `INSERT INTO team_auth.password_links (token_hash, account_id, purpose, expires_at)
     VALUES ($1, $2, $3, now() + make_interval(hours => $4))`,
    [tokenHash(token), accountId, purpose, hours],
  );
  return token;
}

export async function findPasswordLink(token: string) {
  if (!/^[A-Za-z0-9_-]{40,60}$/.test(token)) return null;
  const { rows } = await (await db()).query<{ purpose: 'invite' | 'reset'; email: string; name: string; active: boolean }>(
    `SELECT l.purpose, a.email, a.name, a.active FROM team_auth.password_links l
       JOIN team_auth.accounts a ON a.id = l.account_id
      WHERE l.token_hash = $1 AND l.expires_at > now()`,
    [tokenHash(token)],
  );
  return rows[0]?.active ? rows[0] : null;
}

// Sets the password, consumes the link, and ends any other sessions.
export async function consumePasswordLink(token: string, password: string): Promise<AccountRow | null> {
  const pool = await db();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query<{ account_id: string }>(
      'DELETE FROM team_auth.password_links WHERE token_hash = $1 AND expires_at > now() RETURNING account_id',
      [tokenHash(token)],
    );
    if (!rows[0]) {
      await client.query('ROLLBACK');
      return null;
    }
    const { rows: acc } = await client.query<AccountRow>(
      `UPDATE team_auth.accounts
          SET password_hash = $2, session_version = session_version + 1, last_login_at = now()
        WHERE id = $1 AND active RETURNING *`,
      [rows[0].account_id, await hashPassword(password)],
    );
    await client.query('COMMIT');
    forgetCachedSessions();
    return acc[0] ?? null;
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}

// ── Audit log ──────────────────────────────────────────────────────────────

export async function audit(
  actor: Pick<Session, 'id' | 'email'> | null,
  action: string,
  target: string | null,
  detail: Record<string, unknown> | null = null,
  ip: string | null = null,
) {
  await (await db()).query(
    'INSERT INTO team_auth.audit_log (actor_id, actor_email, action, target_email, detail, ip) VALUES ($1, $2, $3, $4, $5, $6)',
    [actor?.id ?? null, actor?.email ?? null, action, target, detail ? JSON.stringify(detail) : null, ip],
  );
}
