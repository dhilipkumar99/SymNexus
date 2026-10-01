// Account administration, with Slack-style permissions:
//
//   Master admin (owner)  everything below, plus creating and managing admins.
//                         Exactly one; cannot be deactivated, removed or demoted.
//   Admin                 invite, deactivate, reactivate, reset and remove members.
//   Member                manage their own password and sessions only.
//
// Every change is written to team_auth.audit_log.

import { audit, createPasswordLink, forgetCachedSessions, hashPassword, verifyPassword, validatePassword, type AccountRow, type Role, type Session } from './auth.ts';
import { setBurstUserDeactivated } from './burst.ts';
import { db } from './db.ts';

export type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function allowedDomains(): string[] {
  return (process.env.ALLOWED_EMAIL_DOMAINS ?? 'symnexus.co')
    .split(',')
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean);
}

export const isAdmin = (s: Session | null) => s?.role === 'owner' || s?.role === 'admin';

// Whether `actor` may change `target` at all.
function canManage(actor: Session, target: Pick<AccountRow, 'id' | 'role'>): boolean {
  if (actor.id === target.id || target.role === 'owner') return false;
  if (actor.role === 'owner') return true;
  return actor.role === 'admin' && target.role === 'member';
}

async function getAccount(id: string): Promise<AccountRow | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const { rows } = await (await db()).query<AccountRow>('SELECT * FROM team_auth.accounts WHERE id = $1', [id]);
  return rows[0] ?? null;
}

export interface AccountListRow {
  id: string;
  email: string;
  name: string;
  role: Role;
  active: boolean;
  pending: boolean; // invited or reset, no password set yet
  created_at: Date;
  last_login_at: Date | null;
}

export async function listAccounts(): Promise<AccountListRow[]> {
  const { rows } = await (await db()).query<AccountListRow>(
    `SELECT id, email, name, role, active, (password_hash IS NULL) AS pending, created_at, last_login_at
       FROM team_auth.accounts
      ORDER BY CASE role WHEN 'owner' THEN 0 WHEN 'admin' THEN 1 ELSE 2 END, lower(name)`,
  );
  return rows;
}

export async function listAudit(limit = 100) {
  const { rows } = await (await db()).query(
    'SELECT at, actor_email, action, target_email, detail FROM team_auth.audit_log ORDER BY at DESC LIMIT $1',
    [limit],
  );
  return rows as { at: Date; actor_email: string | null; action: string; target_email: string | null; detail: Record<string, unknown> | null }[];
}

export async function inviteAccount(
  actor: Session,
  input: { email: string; name: string; role: Role },
  ip: string,
): Promise<Result<{ token: string; email: string }>> {
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();
  if (!EMAIL_RE.test(email) || email.length > 254) return { ok: false, error: 'Enter a valid email address.' };
  if (!name || name.length > 100) return { ok: false, error: 'Enter a name (up to 100 characters).' };
  const domains = allowedDomains();
  if (domains.length && !domains.includes(email.split('@')[1])) {
    return { ok: false, error: `Only ${domains.map((d) => '@' + d).join(', ')} addresses can be invited.` };
  }
  if (input.role === 'owner') return { ok: false, error: 'There is only one master admin.' };
  if (input.role === 'admin' && actor.role !== 'owner') return { ok: false, error: 'Only the master admin can add admins.' };
  if (!isAdmin(actor)) return { ok: false, error: 'You do not have permission to invite people.' };

  const pool = await db();
  const existing = await pool.query('SELECT 1 FROM team_auth.accounts WHERE email = $1', [email]);
  if (existing.rowCount) return { ok: false, error: `${email} already has an account.` };
  const { rows } = await pool.query<{ id: string }>(
    'INSERT INTO team_auth.accounts (email, name, role, created_by) VALUES ($1, $2, $3, $4) RETURNING id',
    [email, name, input.role, actor.id],
  );
  const token = await createPasswordLink(rows[0].id, 'invite');
  await audit(actor, 'account.invited', email, { role: input.role }, ip);
  return { ok: true, token, email };
}

export async function setRole(actor: Session, id: string, role: Role, ip: string): Promise<Result> {
  const target = await getAccount(id);
  if (!target) return { ok: false, error: 'Account not found.' };
  if (actor.role !== 'owner') return { ok: false, error: 'Only the master admin can change roles.' };
  if (!canManage(actor, target) || role === 'owner') return { ok: false, error: 'That role change is not allowed.' };
  await (await db()).query('UPDATE team_auth.accounts SET role = $2 WHERE id = $1', [id, role]);
  forgetCachedSessions();
  await audit(actor, 'account.role_changed', target.email, { from: target.role, to: role }, ip);
  return { ok: true };
}

export async function setActive(actor: Session, id: string, active: boolean, ip: string): Promise<Result> {
  const target = await getAccount(id);
  if (!target) return { ok: false, error: 'Account not found.' };
  if (!canManage(actor, target)) return { ok: false, error: 'You cannot change this account.' };
  await (await db()).query(
    'UPDATE team_auth.accounts SET active = $2, session_version = session_version + 1 WHERE id = $1',
    [id, active],
  );
  forgetCachedSessions();
  await setBurstUserDeactivated(actor, target.email, !active);
  await audit(actor, active ? 'account.reactivated' : 'account.deactivated', target.email, null, ip);
  return { ok: true };
}

export async function removeAccount(actor: Session, id: string, ip: string): Promise<Result> {
  const target = await getAccount(id);
  if (!target) return { ok: false, error: 'Account not found.' };
  if (!canManage(actor, target)) return { ok: false, error: 'You cannot remove this account.' };
  // Their messages stay in the workspace, shown under a deactivated user.
  await setBurstUserDeactivated(actor, target.email, true);
  await (await db()).query('DELETE FROM team_auth.accounts WHERE id = $1', [id]);
  forgetCachedSessions();
  await audit(actor, 'account.removed', target.email, { role: target.role }, ip);
  return { ok: true };
}

export async function resetPassword(actor: Session, id: string, ip: string): Promise<Result<{ token: string; email: string }>> {
  const target = await getAccount(id);
  if (!target) return { ok: false, error: 'Account not found.' };
  if (!canManage(actor, target)) return { ok: false, error: 'You cannot reset this password.' };
  await (await db()).query(
    'UPDATE team_auth.accounts SET password_hash = NULL, session_version = session_version + 1 WHERE id = $1',
    [id],
  );
  forgetCachedSessions();
  const token = await createPasswordLink(id, 'reset');
  await audit(actor, 'account.password_reset', target.email, null, ip);
  return { ok: true, token, email: target.email };
}

export async function signOutEverywhere(actor: Session, id: string, ip: string): Promise<Result> {
  const target = await getAccount(id);
  if (!target) return { ok: false, error: 'Account not found.' };
  if (actor.id !== id && !canManage(actor, target)) return { ok: false, error: 'You cannot sign this person out.' };
  await (await db()).query('UPDATE team_auth.accounts SET session_version = session_version + 1 WHERE id = $1', [id]);
  forgetCachedSessions();
  await audit(actor, 'account.signed_out_everywhere', target.email, null, ip);
  return { ok: true };
}

export async function changeOwnPassword(
  session: Session,
  current: string,
  next: string,
  ip: string,
): Promise<Result<{ account: AccountRow }>> {
  const target = await getAccount(session.id);
  if (!target || !(await verifyPassword(current, target.password_hash))) {
    return { ok: false, error: 'Your current password is not correct.' };
  }
  const problem = validatePassword(next);
  if (problem) return { ok: false, error: problem };
  if (next === current) return { ok: false, error: 'Choose a password different from the current one.' };
  const { rows } = await (await db()).query<AccountRow>(
    `UPDATE team_auth.accounts SET password_hash = $2, session_version = session_version + 1
      WHERE id = $1 RETURNING *`,
    [session.id, await hashPassword(next)],
  );
  forgetCachedSessions();
  await audit(session, 'account.password_changed', session.email, null, ip);
  return { ok: true, account: rows[0] };
}

// Used once, from the command line, to create the master admin.
export async function createOwner(email: string, name: string): Promise<Result<{ token: string }>> {
  const pool = await db();
  const owner = await pool.query('SELECT email FROM team_auth.accounts WHERE role = $1', ['owner']);
  if (owner.rowCount) return { ok: false, error: `A master admin already exists (${owner.rows[0].email}).` };
  const { rows } = await pool.query<{ id: string }>(
    'INSERT INTO team_auth.accounts (email, name, role) VALUES ($1, $2, $3) RETURNING id',
    [email.trim().toLowerCase(), name.trim(), 'owner'],
  );
  const token = await createPasswordLink(rows[0].id, 'invite');
  await audit(null, 'account.owner_created', email.trim().toLowerCase(), { via: 'cli' });
  return { ok: true, token };
}

// Break-glass recovery for the master admin, from the command line.
export async function ownerRecoveryLink(): Promise<Result<{ token: string; email: string }>> {
  const { rows } = await (await db()).query<AccountRow>("SELECT * FROM team_auth.accounts WHERE role = 'owner'");
  if (!rows[0]) return { ok: false, error: 'There is no master admin yet.' };
  await (await db()).query(
    'UPDATE team_auth.accounts SET active = true, session_version = session_version + 1 WHERE id = $1',
    [rows[0].id],
  );
  forgetCachedSessions();
  const token = await createPasswordLink(rows[0].id, 'reset');
  await audit(null, 'account.owner_recovery', rows[0].email, { via: 'cli' });
  return { ok: true, token, email: rows[0].email };
}
