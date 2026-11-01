// Email campaigns: templates, recipient lists, scheduling and follow-ups,
// sent from the shared mailbox by lib/mail/dispatch.ts.
//
//   draft ─launch─> scheduled ─(start time)─> sending ─(all sent)─> completed
//                       └──────── pause / resume ──────┘
//   any unfinished campaign can be stopped: emails not yet sent are cancelled.
//
// The master admin and admins use campaigns; every change is written to the
// audit log (team_auth.audit_log, actions "campaign.*").

import { randomBytes } from 'node:crypto';
import { isAdmin, type Result } from '../accounts.ts';
import { audit, type Session } from '../auth.ts';
import { db } from '../db.ts';
import { composeEmail, missingVariables, type Sender } from './compose.ts';
import { CsvError, normalizeEmail, readRecipients, type Column } from './csv.ts';
import { MailError, type Mailer } from './graph.ts';
import { parseTemplate, TemplateError, templateVariables } from './template.ts';

export const canUseCampaigns = (s: Session | null) => isAdmin(s);

export type CampaignStatus = 'draft' | 'scheduled' | 'sending' | 'paused' | 'completed' | 'stopped';
export type SendRule = 'all' | 'not_replied' | 'replied';

export const MAX_FOLLOW_UPS = 5;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const fail = (error: string) => ({ ok: false as const, error });

function templateProblem(t: { subject: string; body: string }): string | null {
  try {
    parseTemplate(t.subject);
    parseTemplate(t.body);
    return null;
  } catch (err) {
    if (err instanceof TemplateError) return err.message;
    throw err;
  }
}

// ── Settings ───────────────────────────────────────────────────────────────

export interface Settings {
  fromName: string;
  signature: string;
  footer: string;
  dailyLimit: number;
  lastRunAt: Date | null;
  lastRunError: string | null;
}

export async function getSettings(): Promise<Settings> {
  const { rows: [s] } = await (await db()).query('SELECT * FROM team_mail.settings');
  return { fromName: s.from_name, signature: s.signature, footer: s.footer, dailyLimit: s.daily_limit, lastRunAt: s.last_run_at, lastRunError: s.last_run_error };
}

export function senderFrom(settings: Settings, mailbox: string): Sender {
  return { fromName: settings.fromName, fromEmail: mailbox, signature: settings.signature, footer: settings.footer };
}

export async function saveSettings(
  actor: Session,
  input: { fromName: string; signature: string; footer: string; dailyLimit: number },
  ip: string,
): Promise<Result> {
  if (!canUseCampaigns(actor)) return fail('You do not have permission to change campaign settings.');
  const fromName = input.fromName.trim();
  if (!fromName || fromName.length > 100) return fail('Enter a sender name (up to 100 characters).');
  if (input.signature.length > 2000 || input.footer.length > 1000) return fail('The signature or footer is too long.');
  if (!Number.isInteger(input.dailyLimit) || input.dailyLimit < 1 || input.dailyLimit > 10000) {
    return fail('The daily limit must be a whole number from 1 to 10,000 (Microsoft 365 allows 10,000 recipients a day).');
  }
  const problem = templateProblem({ subject: '', body: input.signature });
  if (problem) return fail(`Signature: ${problem}`);
  await (await db()).query(
    `UPDATE team_mail.settings SET from_name = $1, signature = $2, footer = $3, daily_limit = $4, updated_at = now(), updated_by = $5`,
    [fromName, input.signature.trim(), input.footer.trim(), input.dailyLimit, actor.email],
  );
  await audit(actor, 'campaign.settings_changed', null, { daily_limit: input.dailyLimit }, ip);
  return { ok: true };
}

// ── Templates ──────────────────────────────────────────────────────────────

export interface Template {
  id: string;
  name: string;
  subject: string;
  body: string;
  updatedBy: string | null;
  updatedAt: Date;
}

export async function listTemplates(): Promise<Template[]> {
  const { rows } = await (await db()).query(
    'SELECT id, name, subject, body, updated_by, updated_at FROM team_mail.templates ORDER BY lower(name)',
  );
  return rows.map((r) => ({ id: r.id, name: r.name, subject: r.subject, body: r.body, updatedBy: r.updated_by, updatedAt: r.updated_at }));
}

export async function saveTemplate(
  actor: Session,
  input: { id?: string; name: string; subject: string; body: string },
  ip: string,
): Promise<Result<{ id: string }>> {
  if (!canUseCampaigns(actor)) return fail('You do not have permission to edit templates.');
  const name = input.name.trim();
  const subject = input.subject.trim();
  const body = input.body.replace(/\r\n/g, '\n');
  if (!name || name.length > 100) return fail('Enter a template name (up to 100 characters).');
  if (subject.length > 250) return fail('Keep the subject under 250 characters.');
  if (!body.trim() || body.length > 20000) return fail('Write the email (up to 20,000 characters).');
  const problem = templateProblem({ subject, body });
  if (problem) return fail(problem);

  const pool = await db();
  if (input.id) {
    if (!UUID_RE.test(input.id)) return fail('Template not found.');
    const r = await pool.query(
      'UPDATE team_mail.templates SET name = $2, subject = $3, body = $4, updated_by = $5, updated_at = now() WHERE id = $1',
      [input.id, name, subject, body, actor.email],
    );
    if (!r.rowCount) return fail('Template not found.');
    await audit(actor, 'campaign.template_saved', null, { template: name }, ip);
    return { ok: true, id: input.id };
  }
  const { rows } = await pool.query(
    'INSERT INTO team_mail.templates (name, subject, body, created_by, updated_by) VALUES ($1, $2, $3, $4, $4) RETURNING id',
    [name, subject, body, actor.email],
  );
  await audit(actor, 'campaign.template_saved', null, { template: name }, ip);
  return { ok: true, id: rows[0].id };
}

export async function deleteTemplate(actor: Session, id: string, ip: string): Promise<Result> {
  if (!canUseCampaigns(actor)) return fail('You do not have permission to delete templates.');
  if (!UUID_RE.test(id)) return fail('Template not found.');
  const { rows } = await (await db()).query('DELETE FROM team_mail.templates WHERE id = $1 RETURNING name', [id]);
  if (!rows[0]) return fail('Template not found.');
  await audit(actor, 'campaign.template_deleted', null, { template: rows[0].name }, ip);
  return { ok: true };
}

// ── Creating and running campaigns ─────────────────────────────────────────

export interface StepInput {
  templateId: string;
  delayDays: number; // follow-ups: days after the previous email to the same person
  rule: SendRule;
  asReply: boolean;
}

export async function createCampaign(
  actor: Session,
  input: { name: string; csv: string; steps: StepInput[] },
  ip: string,
): Promise<Result<{ id: string }>> {
  if (!canUseCampaigns(actor)) return fail('You do not have permission to create campaigns.');
  const name = input.name.trim();
  if (!name || name.length > 100) return fail('Enter a campaign name (up to 100 characters).');
  if (!input.steps.length) return fail('Choose a template for the first email.');
  if (input.steps.length > 1 + MAX_FOLLOW_UPS) return fail(`A campaign can have at most ${MAX_FOLLOW_UPS} follow-ups.`);

  let list;
  try {
    list = readRecipients(input.csv);
  } catch (err) {
    if (err instanceof CsvError) return fail(err.message);
    throw err;
  }

  const pool = await db();
  const ids = input.steps.map((s) => s.templateId).filter((id) => UUID_RE.test(id));
  const { rows: found } = await pool.query('SELECT id, name, subject, body FROM team_mail.templates WHERE id = ANY($1::uuid[])', [ids]);
  const byId = new Map(found.map((t) => [t.id, t]));
  const settings = await getSettings();
  const columns = list.columns.map((c) => c.key);

  const steps = [];
  for (const [i, s] of input.steps.entries()) {
    const label = i === 0 ? 'The first email' : `Follow-up ${i}`;
    const t = byId.get(s.templateId);
    if (!t) return fail(`${label}: choose a template.`);
    const rule: SendRule = i === 0 ? 'all' : s.rule;
    if (!['all', 'not_replied', 'replied'].includes(rule)) return fail(`${label}: choose who receives it.`);
    const delay = i === 0 ? 0 : s.delayDays;
    if (i > 0 && (!Number.isInteger(delay) || delay < 1 || delay > 90)) return fail(`${label}: wait between 1 and 90 days.`);
    const asReply = i > 0 && s.asReply;
    if (!asReply && !t.subject.trim()) return fail(`${label}: template "${t.name}" has no subject. Add one, or send the follow-up as a reply.`);
    const problem = templateProblem(t);
    if (problem) return fail(`${label}, template "${t.name}": ${problem}`);
    const missing = missingVariables(t, columns, settings.signature);
    if (missing.length) {
      return fail(
        `${label}, template "${t.name}", uses ${missing.map((m) => `{{ ${m} }}`).join(', ')}, which the list does not have. ` +
          `Columns: ${columns.join(', ')}.`,
      );
    }
    steps.push({ position: i, t, rule, delay, asReply });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows: [c] } = await client.query(
      'INSERT INTO team_mail.campaigns (name, columns, created_by) VALUES ($1, $2, $3) RETURNING id',
      [name, JSON.stringify(list.columns), actor.email],
    );
    for (const s of steps) {
      await client.query(
        `INSERT INTO team_mail.steps (campaign_id, position, template_name, subject, body, delay_days, rule, as_reply)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [c.id, s.position, s.t.name, s.t.subject, s.t.body, s.delay, s.rule, s.asReply],
      );
    }
    for (let i = 0; i < list.recipients.length; i += 1000) {
      const chunk = list.recipients.slice(i, i + 1000);
      await client.query(
        `INSERT INTO team_mail.recipients (campaign_id, email, data, unsub_token)
         SELECT $1, e, d, t FROM unnest($2::text[], $3::jsonb[], $4::text[]) AS x(e, d, t)`,
        [c.id, chunk.map((r) => r.email), chunk.map((r) => JSON.stringify(r.data)), chunk.map(() => randomBytes(16).toString('base64url'))],
      );
    }
    await client.query('COMMIT');
    await audit(actor, 'campaign.created', null, { campaign_id: c.id, name, recipients: list.recipients.length }, ip);
    return { ok: true, id: c.id };
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}

async function campaignRow(id: string) {
  if (!UUID_RE.test(id)) return null;
  const { rows } = await (await db()).query('SELECT * FROM team_mail.campaigns WHERE id = $1', [id]);
  return rows[0] ?? null;
}

export async function launchCampaign(actor: Session, id: string, startAt: Date | null, ip: string, now = new Date()): Promise<Result> {
  if (!canUseCampaigns(actor)) return fail('You do not have permission to launch campaigns.');
  const c = await campaignRow(id);
  if (!c) return fail('Campaign not found.');
  if (c.status !== 'draft') return fail('This campaign has already been launched.');
  if (startAt && (Number.isNaN(startAt.getTime()) || startAt.getTime() > now.getTime() + 365 * 86400_000)) return fail('Choose a valid start time.');
  const start = startAt && startAt > now ? startAt : now;
  const status: CampaignStatus = start > now ? 'scheduled' : 'sending';

  const client = await (await db()).connect();
  try {
    await client.query('BEGIN');
    const r = await client.query(
      `UPDATE team_mail.campaigns SET status = $2::text, start_at = $3::timestamptz,
              started_at = CASE WHEN $2::text = 'sending' THEN $3::timestamptz END
        WHERE id = $1 AND status = 'draft'`,
      [id, status, start],
    );
    if (!r.rowCount) {
      await client.query('ROLLBACK');
      return fail('This campaign has already been launched.');
    }
    await client.query(
      `INSERT INTO team_mail.messages (campaign_id, step_id, recipient_id, due_at)
       SELECT r.campaign_id, s.id, r.id, $2 FROM team_mail.recipients r
         JOIN team_mail.steps s ON s.campaign_id = r.campaign_id AND s.position = 0
        WHERE r.campaign_id = $1`,
      [id, start],
    );
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    client.release();
  }
  await audit(actor, 'campaign.launched', null, { campaign_id: id, name: c.name, start_at: start.toISOString() }, ip);
  return { ok: true };
}

export type CampaignChange = 'pause' | 'resume' | 'stop' | 'delete';

export async function changeCampaign(actor: Session, id: string, change: CampaignChange, ip: string, now = new Date()): Promise<Result> {
  if (!canUseCampaigns(actor)) return fail('You do not have permission to change campaigns.');
  const c = await campaignRow(id);
  if (!c) return fail('Campaign not found.');
  const pool = await db();
  let r;
  switch (change) {
    case 'pause':
      r = await pool.query(`UPDATE team_mail.campaigns SET status = 'paused' WHERE id = $1 AND status IN ('sending', 'scheduled')`, [id]);
      break;
    case 'resume':
      r = await pool.query(
        `UPDATE team_mail.campaigns SET status = CASE WHEN start_at > $2 THEN 'scheduled' ELSE 'sending' END,
                started_at = coalesce(started_at, CASE WHEN start_at <= $2 THEN $2::timestamptz END),
                error = NULL, consecutive_failures = 0
          WHERE id = $1 AND status = 'paused'`,
        [id, now],
      );
      break;
    case 'stop':
      r = await pool.query(
        `UPDATE team_mail.campaigns SET status = 'stopped', completed_at = $2 WHERE id = $1 AND status IN ('scheduled', 'sending', 'paused')`,
        [id, now],
      );
      if (r.rowCount) {
        await pool.query(`UPDATE team_mail.messages SET status = 'cancelled' WHERE campaign_id = $1 AND status = 'queued'`, [id]);
      }
      break;
    case 'delete':
      r = await pool.query(`DELETE FROM team_mail.campaigns WHERE id = $1 AND status IN ('draft', 'completed', 'stopped')`, [id]);
      if (!r.rowCount) return fail('Stop the campaign before deleting it.');
      break;
  }
  if (!r.rowCount) return fail(`The campaign cannot be ${{ pause: 'paused', resume: 'resumed', stop: 'stopped', delete: 'deleted' }[change]} now.`);
  await audit(actor, `campaign.${{ pause: 'paused', resume: 'resumed', stop: 'stopped', delete: 'deleted' }[change]}`, null, { campaign_id: id, name: c.name }, ip);
  return { ok: true };
}

export async function setReplied(actor: Session, campaignId: string, recipientId: string, replied: boolean, ip: string, now = new Date()): Promise<Result> {
  if (!canUseCampaigns(actor)) return fail('You do not have permission to change campaigns.');
  if (!UUID_RE.test(campaignId) || !/^\d{1,18}$/.test(recipientId)) return fail('Person not found.');
  const { rows } = await (await db()).query(
    `UPDATE team_mail.recipients SET replied_at = CASE WHEN $3 THEN coalesce(replied_at, $4) END
      WHERE id = $1 AND campaign_id = $2 RETURNING email`,
    [recipientId, campaignId, replied, now],
  );
  if (!rows[0]) return fail('Person not found.');
  await audit(actor, replied ? 'campaign.marked_replied' : 'campaign.unmarked_replied', rows[0].email, { campaign_id: campaignId }, ip);
  return { ok: true };
}

// A test of one email of the campaign, written for its first person, sent to
// an address of the sender's choosing with "[Test]" in the subject.
export async function sendTest(
  actor: Session,
  mailer: Mailer | null,
  input: { campaignId: string; position: number; to: string },
  publicUrl: string,
  ip: string,
): Promise<Result<{ to: string }>> {
  if (!canUseCampaigns(actor)) return fail('You do not have permission to send test emails.');
  if (!mailer) return fail('Email sending is not connected yet. See "Connection" in Campaign settings.');
  const to = normalizeEmail(input.to);
  if (!to) return fail('Enter a valid address for the test.');
  if (!UUID_RE.test(input.campaignId)) return fail('Campaign not found.');
  const pool = await db();
  const { rows: [step] } = await pool.query('SELECT subject, body FROM team_mail.steps WHERE campaign_id = $1 AND position = $2', [
    input.campaignId,
    input.position,
  ]);
  if (!step) return fail('Campaign not found.');
  const { rows: [first] } = await pool.query('SELECT data FROM team_mail.recipients WHERE campaign_id = $1 ORDER BY id LIMIT 1', [input.campaignId]);
  const email = composeEmail(step, first?.data ?? {}, senderFrom(await getSettings(), mailer.mailbox), `${publicUrl}/unsubscribe/test`);
  try {
    await mailer.send({ to, subject: `[Test] ${email.subject || '(reply in thread)'}`, html: email.html, fragment: email.fragment });
  } catch (err) {
    if (err instanceof MailError) return fail(`Microsoft 365 did not send it: ${err.message}`);
    throw err;
  }
  await audit(actor, 'campaign.test_sent', to, { campaign_id: input.campaignId, position: input.position }, ip);
  return { ok: true, to };
}

// ── Reading campaigns ──────────────────────────────────────────────────────

export interface CampaignSummary {
  id: string;
  name: string;
  status: CampaignStatus;
  createdBy: string;
  createdAt: Date;
  startAt: Date | null;
  recipients: number;
  sent: number;
  replied: number;
  failed: number;
  error: string | null;
}

const SUMMARY = `
  SELECT c.id, c.name, c.status, c.created_by, c.created_at, c.start_at, c.started_at, c.completed_at, c.error, c.columns,
         (SELECT count(*)::int FROM team_mail.recipients r WHERE r.campaign_id = c.id) AS recipients,
         (SELECT count(*)::int FROM team_mail.recipients r WHERE r.campaign_id = c.id AND r.replied_at IS NOT NULL) AS replied,
         (SELECT count(*)::int FROM team_mail.messages m WHERE m.campaign_id = c.id AND m.status = 'sent') AS sent,
         (SELECT count(*)::int FROM team_mail.messages m WHERE m.campaign_id = c.id AND m.status = 'failed') AS failed
    FROM team_mail.campaigns c`;

function summary(r: Record<string, unknown>): CampaignSummary {
  return {
    id: r.id as string,
    name: r.name as string,
    status: r.status as CampaignStatus,
    createdBy: r.created_by as string,
    createdAt: r.created_at as Date,
    startAt: r.start_at as Date | null,
    recipients: r.recipients as number,
    sent: r.sent as number,
    replied: r.replied as number,
    failed: r.failed as number,
    error: r.error as string | null,
  };
}

export async function listCampaigns(): Promise<CampaignSummary[]> {
  const { rows } = await (await db()).query(`${SUMMARY} ORDER BY c.created_at DESC LIMIT 200`);
  return rows.map(summary);
}

export async function hasActiveCampaigns(): Promise<boolean> {
  const { rows } = await (await db()).query(`SELECT 1 FROM team_mail.campaigns WHERE status IN ('sending', 'scheduled') LIMIT 1`);
  return rows.length > 0;
}

export interface StepDetail {
  position: number;
  templateName: string;
  subject: string;
  body: string;
  delayDays: number;
  rule: SendRule;
  asReply: boolean;
  queued: number;
  sent: number;
  failed: number;
  skipped: number;
  cancelled: number;
}

export interface CampaignDetail extends CampaignSummary {
  columns: Column[];
  startedAt: Date | null;
  completedAt: Date | null;
  unsubscribed: number;
  steps: StepDetail[];
  emptyValues: { variable: string; count: number }[]; // used without a default, blank for some people
}

export async function getCampaign(id: string): Promise<CampaignDetail | null> {
  if (!UUID_RE.test(id)) return null;
  const pool = await db();
  const { rows: [c] } = await pool.query(`${SUMMARY} WHERE c.id = $1`, [id]);
  if (!c) return null;
  const { rows: steps } = await pool.query(
    `SELECT s.position, s.template_name, s.subject, s.body, s.delay_days, s.rule, s.as_reply,
            count(m.id) FILTER (WHERE m.status IN ('queued', 'sending'))::int AS queued,
            count(m.id) FILTER (WHERE m.status = 'sent')::int AS sent,
            count(m.id) FILTER (WHERE m.status = 'failed')::int AS failed,
            count(m.id) FILTER (WHERE m.status = 'skipped')::int AS skipped,
            count(m.id) FILTER (WHERE m.status = 'cancelled')::int AS cancelled
       FROM team_mail.steps s LEFT JOIN team_mail.messages m ON m.step_id = s.id
      WHERE s.campaign_id = $1 GROUP BY s.id ORDER BY s.position`,
    [id],
  );
  const { rows: [{ unsubscribed }] } = await pool.query(
    `SELECT count(*)::int AS unsubscribed FROM team_mail.recipients r JOIN team_mail.suppressions x ON x.email = r.email WHERE r.campaign_id = $1`,
    [id],
  );

  // Variables without a default that are blank for some people ("Hi ,").
  const required = new Set<string>();
  for (const s of steps) {
    for (const src of [s.subject, s.body]) for (const [name, v] of templateVariables(src)) if (!v.hasDefault) required.add(name);
  }
  const columnKeys = new Set((c.columns as Column[]).map((col) => col.key));
  const emptyValues = [];
  for (const variable of [...required].filter((n) => columnKeys.has(n))) {
    const { rows: [{ count }] } = await pool.query(
      `SELECT count(*)::int AS count FROM team_mail.recipients WHERE campaign_id = $1 AND coalesce(trim(data->>$2), '') = ''`,
      [id, variable],
    );
    if (count) emptyValues.push({ variable, count });
  }

  return {
    ...summary(c),
    columns: c.columns,
    startedAt: c.started_at,
    completedAt: c.completed_at,
    unsubscribed,
    emptyValues,
    steps: steps.map((s) => ({
      position: s.position,
      templateName: s.template_name,
      subject: s.subject,
      body: s.body,
      delayDays: s.delay_days,
      rule: s.rule,
      asReply: s.as_reply,
      queued: s.queued,
      sent: s.sent,
      failed: s.failed,
      skipped: s.skipped,
      cancelled: s.cancelled,
    })),
  };
}

export type RecipientFilter = 'all' | 'replied' | 'failed' | 'unsubscribed' | 'waiting';

export interface RecipientRow {
  id: string;
  email: string;
  data: Record<string, string>;
  repliedAt: Date | null;
  unsubscribed: boolean;
  messages: { position: number; status: string; error: string | null; at: string | null }[];
}

export async function listRecipients(campaignId: string, filter: RecipientFilter, search: string, limit = 100): Promise<{ rows: RecipientRow[]; total: number }> {
  if (!UUID_RE.test(campaignId)) return { rows: [], total: 0 };
  const where = {
    all: 'true',
    replied: 'r.replied_at IS NOT NULL',
    failed: `EXISTS (SELECT 1 FROM team_mail.messages m WHERE m.recipient_id = r.id AND m.status = 'failed')`,
    unsubscribed: 'EXISTS (SELECT 1 FROM team_mail.suppressions x WHERE x.email = r.email)',
    waiting: `EXISTS (SELECT 1 FROM team_mail.messages m WHERE m.recipient_id = r.id AND m.status IN ('queued', 'sending'))`,
  }[filter];
  const params = [campaignId, `%${search.trim().toLowerCase().replace(/[\\%_]/g, '\\$&')}%`];
  const pool = await db();
  const { rows } = await pool.query(
    `SELECT r.id::text, r.email, r.data, r.replied_at,
            EXISTS (SELECT 1 FROM team_mail.suppressions x WHERE x.email = r.email) AS unsubscribed,
            coalesce((SELECT json_agg(json_build_object('position', s.position, 'status', m.status, 'error', m.error,
                                                        'at', coalesce(m.sent_at, m.due_at)) ORDER BY s.position)
                        FROM team_mail.messages m JOIN team_mail.steps s ON s.id = m.step_id WHERE m.recipient_id = r.id), '[]') AS messages
       FROM team_mail.recipients r
      WHERE r.campaign_id = $1 AND r.email LIKE $2 AND ${where}
      ORDER BY r.id LIMIT ${Math.min(Math.max(limit, 1), 500)}`,
    params,
  );
  const { rows: [{ total }] } = await pool.query(
    `SELECT count(*)::int AS total FROM team_mail.recipients r WHERE r.campaign_id = $1 AND r.email LIKE $2 AND ${where}`,
    params,
  );
  return {
    total,
    rows: rows.map((r) => ({ id: r.id, email: r.email, data: r.data, repliedAt: r.replied_at, unsubscribed: r.unsubscribed, messages: r.messages })),
  };
}

export async function campaignActivity(campaignId: string) {
  const { rows } = await (await db()).query(
    `SELECT at, actor_email, action, target_email, detail FROM team_auth.audit_log
      WHERE action LIKE 'campaign.%' AND detail->>'campaign_id' = $1 ORDER BY at DESC LIMIT 50`,
    [campaignId],
  );
  return rows as { at: Date; actor_email: string | null; action: string; target_email: string | null; detail: Record<string, unknown> | null }[];
}

// ── Unsubscribes and the suppression list ──────────────────────────────────

export async function listSuppressions(): Promise<{ email: string; reason: string; createdAt: Date; createdBy: string | null }[]> {
  const { rows } = await (await db()).query('SELECT email, reason, created_at, created_by FROM team_mail.suppressions ORDER BY created_at DESC LIMIT 1000');
  return rows.map((r) => ({ email: r.email, reason: r.reason, createdAt: r.created_at, createdBy: r.created_by }));
}

export async function addSuppressions(actor: Session, text: string, ip: string): Promise<Result<{ added: number; invalid: string[] }>> {
  if (!canUseCampaigns(actor)) return fail('You do not have permission to change the suppression list.');
  const entries = text.split(/[\s,;]+/).filter(Boolean);
  if (entries.length > 5000) return fail('Add at most 5,000 addresses at a time.');
  const emails = [...new Set(entries.map(normalizeEmail).filter((e): e is string => Boolean(e)))];
  const invalid = entries.filter((e) => !normalizeEmail(e));
  if (!emails.length) return fail('Enter at least one valid email address.');
  const { rowCount } = await (await db()).query(
    `INSERT INTO team_mail.suppressions (email, reason, created_by) SELECT unnest($1::text[]), 'manual', $2 ON CONFLICT DO NOTHING`,
    [emails, actor.email],
  );
  await audit(actor, 'campaign.suppressed', null, { count: rowCount }, ip);
  return { ok: true, added: rowCount ?? 0, invalid };
}

export async function removeSuppression(actor: Session, email: string, ip: string): Promise<Result> {
  if (!canUseCampaigns(actor)) return fail('You do not have permission to change the suppression list.');
  const { rowCount } = await (await db()).query('DELETE FROM team_mail.suppressions WHERE email = $1', [email.trim().toLowerCase()]);
  if (!rowCount) return fail('That address is not on the list.');
  await audit(actor, 'campaign.unsuppressed', email.trim().toLowerCase(), null, ip);
  return { ok: true };
}

const TOKEN_RE = /^[A-Za-z0-9_-]{22}$/;

export async function recipientForToken(token: string): Promise<{ email: string; unsubscribed: boolean } | null> {
  if (!TOKEN_RE.test(token)) return null;
  const { rows } = await (await db()).query(
    `SELECT r.email, EXISTS (SELECT 1 FROM team_mail.suppressions x WHERE x.email = r.email) AS unsubscribed
       FROM team_mail.recipients r WHERE r.unsub_token = $1`,
    [token],
  );
  return rows[0] ?? null;
}

// From the link in an email footer: no sign-in, the token is the proof.
export async function unsubscribe(token: string): Promise<boolean> {
  const r = await recipientForToken(token);
  if (!r) return false;
  const pool = await db();
  await pool.query(`INSERT INTO team_mail.suppressions (email, reason) VALUES ($1, 'unsubscribed') ON CONFLICT DO NOTHING`, [r.email]);
  await pool.query(
    `UPDATE team_mail.messages m SET status = 'skipped', error = 'Unsubscribed'
       FROM team_mail.recipients r WHERE m.recipient_id = r.id AND r.email = $1 AND m.status = 'queued'`,
    [r.email],
  );
  await audit(null, 'campaign.unsubscribed', r.email, null);
  return true;
}
