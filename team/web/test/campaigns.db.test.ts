// Campaign lifecycle against a real Postgres, with a fake mailbox and clock:
//   TEST_DATABASE_URL=postgres://team:team-dev-only@127.0.0.1:5434/team_test npm test
// Skipped when TEST_DATABASE_URL is not set. The team_mail schema in that
// database is dropped and recreated.

import assert from 'node:assert/strict';
import { after, before, describe, test } from 'node:test';

const url = process.env.TEST_DATABASE_URL;
process.env.SESSION_SECRET = 'z'.repeat(48);

describe('campaigns (database)', { skip: !url }, async () => {
  process.env.DATABASE_URL = url;
  const { pool } = await import('../lib/db.ts');
  const c = await import('../lib/mail/campaigns.ts');
  const { runDispatch } = await import('../lib/mail/dispatch.ts');
  const { MailError } = await import('../lib/mail/graph.ts');
  type Mailer = import('../lib/mail/graph.ts').Mailer;
  type Inbound = import('../lib/mail/graph.ts').Inbound;
  type Session = import('../lib/roles.ts').Session;

  const admin: Session = { id: '00000000-0000-4000-8000-000000000001', email: 'ann@symnexus.co', name: 'Ann', role: 'admin' };
  const member: Session = { ...admin, id: '00000000-0000-4000-8000-000000000002', email: 'max@symnexus.co', role: 'member' };
  const ip = '203.0.113.9';
  const DAY = 86400_000;

  let clock = new Date('2026-11-02T14:00:00Z');
  const now = () => clock;

  // A mailbox that records what it sends and can be told to fail.
  const sent: { kind: 'send' | 'reply'; to: string; subject: string; html: string; thread?: string }[] = [];
  let inbox: Inbound[] = [];
  let failNext: InstanceType<typeof MailError>[] = [];
  let failAlways: InstanceType<typeof MailError> | null = null;
  const mailer: Mailer = {
    mailbox: 'info@symnexus.co',
    async send(m) {
      const err = failNext.shift() ?? failAlways;
      if (err) throw err;
      sent.push({ kind: 'send', to: m.to, subject: m.subject, html: m.html });
      return { messageId: `msg-${m.to}`, conversationId: `conv-${m.to}` };
    },
    async reply(thread, m) {
      const err = failNext.shift() ?? failAlways;
      if (err) throw err;
      sent.push({ kind: 'reply', to: m.to, subject: m.subject, html: m.fragment, thread });
      return { messageId: `reply-${m.to}`, conversationId: `conv-${m.to}` };
    },
    async received(since) {
      return { messages: inbox.filter((m) => m.receivedAt >= since), more: false };
    },
    async check() {},
  };
  const run = (extra: Partial<Parameters<typeof runDispatch>[0]> = {}) =>
    runDispatch({ mailer, publicUrl: 'https://team.example', now, pauseMs: 0, ...extra });

  const db = () => pool();
  async function messages(campaignId: string) {
    const { rows } = await db().query(
      `SELECT r.email, s.position, m.status, m.error, m.attempts, m.due_at FROM team_mail.messages m
         JOIN team_mail.recipients r ON r.id = m.recipient_id JOIN team_mail.steps s ON s.id = m.step_id
        WHERE m.campaign_id = $1 ORDER BY s.position, r.email`,
      [campaignId],
    );
    return rows;
  }
  const status = async (id: string) => (await db().query('SELECT status, error FROM team_mail.campaigns WHERE id = $1', [id])).rows[0];

  let intro: string, bump: string;
  const CSV = 'First Name,Email,Company\nJane,jane@acme.com,Acme\nJoe,joe@beta.io,\nJen,jen@gamma.org,Gamma\n';

  async function newCampaign(name: string, csv = CSV, followUp = true) {
    const steps: import('../lib/mail/campaigns.ts').StepInput[] = [{ templateId: intro, delayDays: 0, rule: 'all', asReply: false }];
    if (followUp) steps.push({ templateId: bump, delayDays: 3, rule: 'not_replied', asReply: true });
    const r = await c.createCampaign(admin, { name, csv, steps }, ip);
    assert.ok(r.ok, r.ok ? '' : r.error);
    return r.id;
  }

  before(async () => {
    await pool().query('DROP SCHEMA IF EXISTS team_mail CASCADE');
    globalThis.__teamSchema = undefined;
  });
  after(async () => {
    await pool().end();
  });

  test('templates: validated, admins only', async () => {
    assert.equal((await c.saveTemplate(member, { name: 'x', subject: 's', body: 'b' }, ip)).ok, false);
    assert.equal((await c.saveTemplate(admin, { name: 'x', subject: 's', body: '{% if a %}' }, ip)).ok, false);
    const a = await c.saveTemplate(
      admin,
      { name: 'Intro', subject: 'Quick question, {{ first_name }}', body: 'Hi {{ first_name }},\n{% if company %}\nI saw {{ company }}.\n{% endif %}\nTalk soon' },
      ip,
    );
    const b = await c.saveTemplate(admin, { name: 'Bump', subject: '', body: 'Just bumping this, {{ first_name }}.' }, ip);
    assert.ok(a.ok && b.ok);
    intro = a.ok ? a.id : '';
    bump = b.ok ? b.id : '';
    await c.saveSettings(admin, { fromName: 'SymNexus', signature: 'Best,\n{{ from_name }}', footer: '1 Main St', dailyLimit: 300 }, ip);
  });

  test('creating: list and templates must fit together', async () => {
    const steps = [{ templateId: intro, delayDays: 0, rule: 'all' as const, asReply: false }];
    const noName = await c.createCampaign(admin, { name: 'x', csv: 'Email\na@b.co', steps }, ip);
    assert.ok(!noName.ok && /first_name/.test(noName.error), 'template variable missing from the list');
    const noSubject = await c.createCampaign(admin, { name: 'x', csv: CSV, steps: [{ ...steps[0], templateId: bump }] }, ip);
    assert.ok(!noSubject.ok && /no subject/.test(noSubject.error));
    assert.equal((await c.createCampaign(member, { name: 'x', csv: CSV, steps }, ip)).ok, false);
  });

  test('launch, send, reply detection and a not-replied follow-up in the thread', async () => {
    const id = await newCampaign('Outreach');
    const draft = await c.getCampaign(id);
    assert.equal(draft?.recipients, 3);
    assert.deepEqual(draft?.emptyValues, [], 'company is only used inside an if');
    assert.equal((await run()).sent, 0, 'drafts send nothing');

    assert.ok((await c.launchCampaign(admin, id, null, ip, clock)).ok);
    assert.equal((await c.launchCampaign(admin, id, null, ip, clock)).ok, false, 'only once');
    const r1 = await run();
    assert.equal(r1.sent, 3);
    assert.equal(sent[0].subject, 'Quick question, Jane');
    assert.match(sent[0].html, /Hi Jane,<br>I saw Acme\.<br>Talk soon/);
    assert.match(sent[1].html, /Hi Joe,<br>Talk soon/, 'no blank line where the if was');
    assert.match(sent[0].html, /https:\/\/team\.example\/unsubscribe\/[A-Za-z0-9_-]{22}/);
    const follow = (await messages(id)).filter((m) => m.position === 1);
    assert.equal(follow.length, 3);
    assert.equal(new Date(follow[0].due_at).getTime(), clock.getTime() + 3 * DAY, 'timed from each person’s email');
    assert.equal((await status(id)).status, 'sending', 'follow-ups pending');

    // Jane replies in the thread from another address; Joe's auto-reply does not count.
    clock = new Date(clock.getTime() + DAY);
    inbox = [
      { from: 'jane.doe@gmail.com', subject: 'RE: Quick question, Jane', conversationId: 'conv-jane@acme.com', receivedAt: clock },
      { from: 'joe@beta.io', subject: 'Automatic reply: Quick question, Joe', conversationId: 'conv-joe@beta.io', receivedAt: clock },
    ];
    assert.equal((await run()).sent, 0, 'follow-ups not due yet');
    assert.equal((await c.getCampaign(id))?.replied, 1);

    clock = new Date(clock.getTime() + 2 * DAY + 60_000);
    sent.length = 0;
    const r2 = await run();
    assert.equal(r2.sent, 2);
    assert.equal(r2.skipped, 1);
    assert.deepEqual(sent.map((s) => [s.kind, s.to, s.thread]).sort(), [
      ['reply', 'jen@gamma.org', 'msg-jen@gamma.org'],
      ['reply', 'joe@beta.io', 'msg-joe@beta.io'],
    ]);
    assert.ok(sent.every((s) => s.subject === ''), 'blank subject keeps RE: in the thread');
    assert.equal((await messages(id)).find((m) => m.email === 'jane@acme.com' && m.position === 1)?.error, 'Already replied');
    assert.equal((await status(id)).status, 'completed');
  });

  test('unsubscribe link stops later emails; suppression applies to every campaign', async () => {
    const id = await newCampaign('Unsub');
    assert.ok((await c.launchCampaign(admin, id, null, ip, clock)).ok);
    await run();
    const { rows: [jen] } = await db().query(`SELECT unsub_token FROM team_mail.recipients WHERE campaign_id = $1 AND email = 'jen@gamma.org'`, [id]);
    assert.deepEqual(await c.recipientForToken(jen.unsub_token), { email: 'jen@gamma.org', unsubscribed: false });
    assert.equal(await c.unsubscribe(jen.unsub_token), true);
    assert.equal(await c.unsubscribe('A'.repeat(22)), false);
    assert.equal((await messages(id)).find((m) => m.email === 'jen@gamma.org' && m.position === 1)?.status, 'skipped');

    const id2 = await newCampaign('After unsub', CSV, false);
    await c.launchCampaign(admin, id2, null, ip, clock);
    sent.length = 0;
    await run();
    assert.deepEqual(sent.map((s) => s.to).sort(), ['jane@acme.com', 'joe@beta.io']);
    assert.equal((await c.getCampaign(id2))?.unsubscribed, 1);
    await c.changeCampaign(admin, id, 'stop', ip, clock);
  });

  test('scheduled start, pause and resume', async () => {
    const id = await newCampaign('Later', CSV, false);
    await c.launchCampaign(admin, id, new Date(clock.getTime() + 3600_000), ip, clock);
    assert.equal((await status(id)).status, 'scheduled');
    assert.equal((await run()).sent, 0);
    clock = new Date(clock.getTime() + 3600_000);
    assert.ok((await c.changeCampaign(admin, id, 'pause', ip, clock)).ok);
    assert.equal((await run()).sent, 0, 'paused');
    assert.ok((await c.changeCampaign(admin, id, 'resume', ip, clock)).ok);
    assert.equal((await status(id)).status, 'sending');
    assert.equal((await run()).sent, 2, 'jen is unsubscribed');
    assert.equal((await status(id)).status, 'completed');
    assert.ok((await c.changeCampaign(admin, id, 'delete', ip, clock)).ok);
  });

  test('Microsoft refusing access pauses every campaign without losing emails', async () => {
    const a = await newCampaign('Auth A', CSV, false);
    const b = await newCampaign('Auth B', CSV, false);
    await c.launchCampaign(admin, a, null, ip, clock);
    await c.launchCampaign(admin, b, null, ip, clock);
    failNext = [new MailError('Access is denied.', 'auth')];
    const r = await run();
    assert.equal(r.sent, 0);
    assert.match((await status(a)).error, /Access is denied/);
    assert.equal((await status(a)).status, 'paused');
    assert.equal((await status(b)).status, 'paused');
    assert.ok((await messages(a)).every((m) => m.status === 'queued' || m.status === 'skipped'));
    assert.ok((await messages(a)).every((m) => m.attempts === 0), 'not counted as an attempt');
    await c.changeCampaign(admin, a, 'stop', ip, clock);
    await c.changeCampaign(admin, b, 'stop', ip, clock);
  });

  test('throttling waits as asked; server errors retry, then fail; repeated failures pause', async () => {
    const id = await newCampaign('Errors', 'Email,First Name,Company\n' + Array.from({ length: 12 }, (_, i) => `p${i}@x.io,P${i},`).join('\n'), false);
    await c.launchCampaign(admin, id, null, ip, clock);
    failNext = [new MailError('Slow down', 'throttled', 120)];
    assert.equal((await run()).sent, 0);
    assert.ok((await messages(id)).some((m) => new Date(m.due_at).getTime() === clock.getTime() + 120_000));

    clock = new Date(clock.getTime() + 121_000);
    failNext = [new MailError('Server busy', 'transient')];
    sent.length = 0;
    const r = await run();
    assert.equal(r.sent, 11, 'one waits five minutes to retry');
    clock = new Date(clock.getTime() + 301_000);
    assert.equal((await run()).sent, 1);
    assert.equal((await status(id)).status, 'completed');

    const bad = await newCampaign('All bad', 'Email,First Name,Company\n' + Array.from({ length: 12 }, (_, i) => `q${i}@x.io,Q${i},`).join('\n'), false);
    await c.launchCampaign(admin, bad, null, ip, clock);
    failAlways = new MailError('Recipient rejected', 'rejected');
    const r2 = await run();
    failAlways = null;
    assert.equal(r2.failed, 10);
    assert.match((await status(bad)).error, /10 failed emails in a row/);
    assert.equal((await status(bad)).status, 'paused');
    await c.changeCampaign(admin, bad, 'stop', ip, clock);
    assert.equal((await messages(bad)).filter((m) => m.status === 'cancelled').length, 2);
  });

  test('daily limit, one run at a time, and no resending after a crash', async () => {
    await c.saveSettings(admin, { fromName: 'SymNexus', signature: '', footer: '', dailyLimit: 1 }, ip);
    clock = new Date(clock.getTime() + 2 * DAY);
    const id = await newCampaign('Limited', CSV, false);
    await c.launchCampaign(admin, id, null, ip, clock);
    assert.equal((await run()).sent, 1);
    assert.equal((await run()).sent, 0, 'limit reached');

    await db().query(`UPDATE team_mail.settings SET lease_owner = 'other', lease_until = $1`, [new Date(clock.getTime() + 60_000)]);
    assert.equal((await run()).ran, false);
    await db().query(`UPDATE team_mail.settings SET lease_owner = NULL, lease_until = NULL`);

    // A run died mid-send: that email is not sent again.
    await db().query(`UPDATE team_mail.messages SET status = 'sending', claimed_at = $2 WHERE campaign_id = $1 AND status = 'queued'`, [
      id,
      new Date(clock.getTime() - 11 * 60_000),
    ]);
    await c.saveSettings(admin, { fromName: 'SymNexus', signature: '', footer: '', dailyLimit: 300 }, ip);
    sent.length = 0;
    await run();
    assert.equal(sent.length, 0);
    assert.ok((await messages(id)).filter((m) => m.status === 'failed').every((m) => /may have been delivered/.test(m.error)));
    assert.equal((await status(id)).status, 'completed');
  });

  test('marking replied by hand, and the activity trail', async () => {
    const id = await newCampaign('Manual', CSV, false);
    await c.launchCampaign(admin, id, null, ip, clock);
    const { rows: [r] } = await db().query(`SELECT id::text FROM team_mail.recipients WHERE campaign_id = $1 LIMIT 1`, [id]);
    assert.ok((await c.setReplied(admin, id, r.id, true, ip)).ok);
    assert.equal((await c.listRecipients(id, 'replied', '')).total, 1);
    assert.equal((await c.listRecipients(id, 'all', 'JOE')).total, 1, 'search ignores case');
    const actions = (await c.campaignActivity(id)).map((e) => e.action);
    assert.deepEqual(actions.sort(), ['campaign.created', 'campaign.launched', 'campaign.marked_replied']);
  });
});
