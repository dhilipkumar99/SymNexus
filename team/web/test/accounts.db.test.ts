// Integration tests against a real Postgres (team/docker-compose.yml):
//   TEST_DATABASE_URL=postgres://team:team-dev-only@127.0.0.1:5434/team_test npm test
// Skipped when TEST_DATABASE_URL is not set. The team_auth schema in that
// database is dropped and recreated.

import assert from 'node:assert/strict';
import { after, before, describe, test } from 'node:test';

const url = process.env.TEST_DATABASE_URL;
process.env.SESSION_SECRET = 'y'.repeat(48);
process.env.ALLOWED_EMAIL_DOMAINS = 'symnexus.co';
process.env.BURST_INTERNAL_URL = 'http://127.0.0.1:9'; // nothing listens: Burst sync is best effort

describe('accounts (database)', { skip: !url }, async () => {
  process.env.DATABASE_URL = url;
  const { pool } = await import('../lib/db.ts');
  const auth = await import('../lib/auth.ts');
  const acc = await import('../lib/accounts.ts');
  type Session = import('../lib/roles.ts').Session;

  const ip = '203.0.113.7';
  let owner: Session, admin: Session, member: Session;

  async function sessionFor(email: string): Promise<Session> {
    const { rows } = await pool().query('SELECT id, email, name, role FROM team_auth.accounts WHERE email = $1', [email]);
    return rows[0];
  }
  async function cookieFor(email: string) {
    const { rows } = await pool().query('SELECT id, session_version FROM team_auth.accounts WHERE email = $1', [email]);
    return auth.createSessionValue(rows[0]);
  }
  async function join(token: string, password: string) {
    const account = await auth.consumePasswordLink(token, password);
    assert.ok(account, 'link should work');
    return account!;
  }

  before(async () => {
    await pool().query('DROP SCHEMA IF EXISTS team_auth CASCADE');
    globalThis.__teamSchema = undefined;
  });
  after(async () => {
    await pool().end();
  });

  test('master admin: created once, with a yahoo.com address, via a set-password link', async () => {
    const r = await acc.createOwner('DhilipKumar_99@Yahoo.com', 'Dhilip Raman');
    assert.ok(r.ok);
    assert.equal((await acc.createOwner('other@symnexus.co', 'Other')).ok, false, 'only one master admin');
    assert.equal((await auth.signIn('dhilipkumar_99@yahoo.com', 'anything at all', ip)).ok, false, 'no password yet');
    const link = await auth.findPasswordLink(r.ok ? r.token : '');
    assert.equal(link?.email, 'dhilipkumar_99@yahoo.com');
    await join(r.ok ? r.token : '', 'master admin passphrase');
    assert.equal(await auth.consumePasswordLink(r.ok ? r.token : '', 'again and again'), null, 'links are single use');
    const signIn = await auth.signIn('dhilipkumar_99@yahoo.com', 'master admin passphrase', ip);
    assert.ok(signIn.ok);
    owner = await sessionFor('dhilipkumar_99@yahoo.com');
    assert.equal(owner.role, 'owner');
  });

  test('invites: master admin adds an admin and a member; domain rule applies to them', async () => {
    assert.equal((await acc.inviteAccount(owner, { email: 'x@gmail.com', name: 'X', role: 'member' }, ip)).ok, false);
    const a = await acc.inviteAccount(owner, { email: 'ann@symnexus.co', name: 'Ann Admin', role: 'admin' }, ip);
    const m = await acc.inviteAccount(owner, { email: 'max@symnexus.co', name: 'Max Member', role: 'member' }, ip);
    assert.ok(a.ok && m.ok);
    assert.equal((await acc.inviteAccount(owner, { email: 'max@symnexus.co', name: 'Dup', role: 'member' }, ip)).ok, false);
    assert.equal((await acc.inviteAccount(owner, { email: 'o2@symnexus.co', name: 'Owner 2', role: 'owner' }, ip)).ok, false);
    await join(a.ok ? a.token : '', 'ann admin passphrase');
    await join(m.ok ? m.token : '', 'max member passphrase');
    admin = await sessionFor('ann@symnexus.co');
    member = await sessionFor('max@symnexus.co');
  });

  test('admins manage members only; members manage nobody; nobody touches the master admin', async () => {
    assert.equal((await acc.inviteAccount(admin, { email: 'a2@symnexus.co', name: 'A2', role: 'admin' }, ip)).ok, false, 'admin cannot add admins');
    assert.ok((await acc.inviteAccount(admin, { email: 'mo@symnexus.co', name: 'Mo', role: 'member' }, ip)).ok, 'admin can add members');
    assert.equal((await acc.inviteAccount(member, { email: 'z@symnexus.co', name: 'Z', role: 'member' }, ip)).ok, false);

    assert.equal((await acc.setRole(admin, member.id, 'admin', ip)).ok, false, 'only the master admin changes roles');
    assert.equal((await acc.setActive(admin, owner.id, false, ip)).ok, false);
    assert.equal((await acc.removeAccount(admin, owner.id, ip)).ok, false);
    assert.equal((await acc.setActive(member, admin.id, false, ip)).ok, false);
    assert.equal((await acc.resetPassword(admin, admin.id, ip)).ok, false, 'not on yourself');
    assert.equal((await acc.setRole(owner, owner.id, 'member', ip)).ok, false, 'master admin cannot demote themselves');

    const mo = await sessionFor('mo@symnexus.co');
    assert.ok((await acc.removeAccount(admin, mo.id, ip)).ok, 'admin can remove a member');
  });

  test('master admin promotes and demotes; the change applies to the next request', async () => {
    const before = await auth.readSession(await cookieFor('max@symnexus.co'));
    assert.equal(before?.role, 'member');
    assert.ok((await acc.setRole(owner, member.id, 'admin', ip)).ok);
    auth.forgetCachedSessions();
    assert.equal((await auth.readSession(await cookieFor('max@symnexus.co')))?.role, 'admin');
    assert.ok((await acc.setRole(owner, member.id, 'member', ip)).ok);
  });

  test('deactivation and reset end sessions immediately; reactivation restores sign-in', async () => {
    const cookie = await cookieFor('max@symnexus.co');
    assert.ok(await auth.readSession(cookie));
    assert.ok((await acc.setActive(admin, member.id, false, ip)).ok);
    assert.equal(await auth.readSession(cookie), null, 'old cookie dead');
    assert.equal((await auth.signIn('max@symnexus.co', 'max member passphrase', ip)).ok, false, 'cannot sign in');
    assert.ok((await acc.setActive(admin, member.id, true, ip)).ok);
    assert.ok((await auth.signIn('max@symnexus.co', 'max member passphrase', ip)).ok);

    const fresh = await cookieFor('max@symnexus.co');
    const reset = await acc.resetPassword(admin, member.id, ip);
    assert.ok(reset.ok);
    assert.equal(await auth.readSession(fresh), null);
    assert.equal((await auth.signIn('max@symnexus.co', 'max member passphrase', ip)).ok, false, 'old password gone');
    await join(reset.ok ? reset.token : '', 'max new passphrase!');
    assert.ok((await auth.signIn('max@symnexus.co', 'max new passphrase!', ip)).ok);
  });

  test('changing your own password keeps you signed in here and signs out elsewhere', async () => {
    const other = await cookieFor('ann@symnexus.co');
    assert.equal((await acc.changeOwnPassword(admin, 'wrong current', 'whatever whatever', ip)).ok, false);
    const r = await acc.changeOwnPassword(admin, 'ann admin passphrase', 'ann second passphrase', ip);
    assert.ok(r.ok);
    assert.equal(await auth.readSession(other), null);
    assert.ok(await auth.readSession(auth.createSessionValue(r.ok ? r.account : { id: '', session_version: 0 })));
  });

  test('sign-in throttle is shared and generic', async () => {
    const wrong = await auth.signIn('ann@symnexus.co', 'wrong password 1', '198.51.100.1');
    const unknown = await auth.signIn('nobody@symnexus.co', 'wrong password 1', '198.51.100.1');
    assert.deepEqual(wrong, unknown);
    let last;
    for (let i = 0; i < 9; i++) last = await auth.signIn('ann@symnexus.co', 'wrong password 2', `198.51.100.${i + 10}`);
    assert.equal(last?.ok, false);
    assert.match(last && !last.ok ? last.error : '', /Too many/);
  });

  test('audit log records who did what', async () => {
    const log = await acc.listAudit(100);
    const actions = log.map((e) => e.action);
    for (const a of ['account.owner_created', 'account.invited', 'account.role_changed', 'account.deactivated', 'account.reactivated', 'account.password_reset', 'account.removed', 'account.password_changed']) {
      assert.ok(actions.includes(a), `missing ${a}`);
    }
    assert.ok(log.some((e) => e.action === 'account.removed' && e.actor_email === 'ann@symnexus.co' && e.target_email === 'mo@symnexus.co'));
  });

  test('owner recovery link from the command line', async () => {
    const cookie = await cookieFor('dhilipkumar_99@yahoo.com');
    const r = await acc.ownerRecoveryLink();
    assert.ok(r.ok);
    assert.equal(await auth.readSession(cookie), null, 'recovery ends existing sessions');
    await join(r.ok ? r.token : '', 'recovered passphrase');
    assert.ok((await auth.signIn('dhilipkumar_99@yahoo.com', 'recovered passphrase', '192.0.2.1')).ok);
  });
});
