// The campaign dispatcher. Each run:
//
//   1. takes the lease (one run at a time across all instances),
//   2. starts scheduled campaigns that are due,
//   3. reads the mailbox for replies to campaign emails,
//   4. sends due emails, paced for Microsoft 365 (about 30 per minute per
//      mailbox) and within the daily limit in Settings,
//   5. marks finished campaigns completed.
//
// Runs are started by the Vercel cron, after someone launches or resumes a
// campaign, and by a run that stopped with work left (see lib/mail/run.ts).
//
// Sending is at most once: an email is marked "sending" before Microsoft is
// called, and one left in that state by a crash is marked failed, not resent.

import { randomUUID } from 'node:crypto';
import type { PoolClient } from 'pg';
import { db } from '../db.ts';
import { composeEmail, type Sender } from './compose.ts';
import { MailError, type Mailer } from './graph.ts';

export interface RunOptions {
  mailer: Mailer;
  publicUrl: string; // for unsubscribe links
  now?: () => Date;
  budgetMs?: number; // stop starting new sends after this long
  pauseMs?: number; // between sends
  sleep?: (ms: number) => Promise<void>;
}

export interface RunResult {
  ran: boolean; // false when another run held the lease
  sent: number;
  failed: number;
  skipped: number;
  more: boolean; // emails are due now but this run stopped early
  error?: string;
}

const LEASE_SECONDS = 330;
const STUCK_MINUTES = 10;
const MAX_ATTEMPTS = 3;
const MAX_CONSECUTIVE_FAILURES = 10;

// Not replies from the person: bounces and auto-responders.
const AUTOMATED_FROM = /^(postmaster|mailer-daemon|microsoftexchange[0-9a-f]*|no-?reply)@/i;
const AUTOMATED_SUBJECT = /^\s*(automatic reply|auto(matic)?[- ]?reply|out of (the )?office|undeliverable|delivery status notification|mail delivery (failed|subsystem)|returned mail)\b/i;

export function isHumanReply(m: { from: string; subject: string }, mailbox: string): boolean {
  return Boolean(m.from) && m.from !== mailbox && !AUTOMATED_FROM.test(m.from) && !AUTOMATED_SUBJECT.test(m.subject);
}

interface Due {
  id: string;
  campaign_id: string;
  step_id: string;
  recipient_id: string;
  position: number;
  subject: string;
  body: string;
  rule: 'all' | 'not_replied' | 'replied';
  as_reply: boolean;
  email: string;
  data: Record<string, string>;
  unsub_token: string;
  thread_message_id: string | null;
  replied_at: Date | null;
  suppressed: boolean;
}

export async function runDispatch(opts: RunOptions): Promise<RunResult> {
  const now = opts.now ?? (() => new Date());
  const owner = randomUUID();
  const pool = await db();
  const lease = await pool.query(
    `UPDATE team_mail.settings SET lease_owner = $1, lease_until = $2::timestamptz + make_interval(secs => $3)
      WHERE lease_until IS NULL OR lease_until < $2 RETURNING id`,
    [owner, now(), LEASE_SECONDS],
  );
  if (!lease.rowCount) return { ran: false, sent: 0, failed: 0, skipped: 0, more: false };

  const client = await pool.connect();
  let result: RunResult = { ran: true, sent: 0, failed: 0, skipped: 0, more: false };
  try {
    result = await run(client, opts, now);
  } catch (err) {
    result.error = err instanceof Error ? err.message : String(err);
    console.error('[campaigns] dispatcher run failed:', err);
  } finally {
    await client
      .query(
        `UPDATE team_mail.settings SET lease_owner = NULL, lease_until = NULL, last_run_at = $2, last_run_error = $3 WHERE lease_owner = $1`,
        [owner, now(), result.error ?? null],
      )
      .catch(() => {});
    client.release();
  }
  return result;
}

async function run(c: PoolClient, opts: RunOptions, now: () => Date): Promise<RunResult> {
  const started = Date.now();
  const budgetMs = opts.budgetMs ?? 240_000;
  const pauseMs = opts.pauseMs ?? 2_500;
  const sleep = opts.sleep ?? ((ms: number) => new Promise((r) => setTimeout(r, ms)));
  const result: RunResult = { ran: true, sent: 0, failed: 0, skipped: 0, more: false };

  await c.query(
    `UPDATE team_mail.messages SET status = 'failed',
            error = 'Interrupted while sending. It may have been delivered, so it was not sent again.'
      WHERE status = 'sending' AND claimed_at < $1::timestamptz - make_interval(mins => $2)`,
    [now(), STUCK_MINUTES],
  );
  await c.query(`UPDATE team_mail.campaigns SET status = 'sending', started_at = coalesce(started_at, $1) WHERE status = 'scheduled' AND start_at <= $1`, [now()]);

  const { rows: [settings] } = await c.query('SELECT * FROM team_mail.settings');
  const sender: Sender = { fromName: settings.from_name, fromEmail: opts.mailer.mailbox, signature: settings.signature, footer: settings.footer };

  const repliesOk = await scanReplies(c, opts.mailer, settings.replies_scanned_at, now).then(
    () => true,
    (err) => {
      result.error = `Could not check for replies: ${err instanceof Error ? err.message : err}`;
      return false;
    },
  );

  const { rows: [{ count: sentToday }] } = await c.query(
    `SELECT count(*)::int AS count FROM team_mail.messages WHERE status = 'sent' AND sent_at > $1::timestamptz - interval '24 hours'`,
    [now()],
  );
  let remaining = settings.daily_limit - sentToday;
  let stop = false;

  while (!stop && remaining > 0 && Date.now() - started < budgetMs) {
    // While replies cannot be checked, follow-ups that depend on them wait.
    const { rows } = await c.query<Due>(
      `SELECT m.id, m.campaign_id, m.step_id, m.recipient_id, s.position, s.subject, s.body, s.rule, s.as_reply,
              r.email, r.data, r.unsub_token, r.thread_message_id, r.replied_at,
              EXISTS (SELECT 1 FROM team_mail.suppressions x WHERE x.email = r.email) AS suppressed
         FROM team_mail.messages m
         JOIN team_mail.steps s ON s.id = m.step_id
         JOIN team_mail.recipients r ON r.id = m.recipient_id
         JOIN team_mail.campaigns c ON c.id = m.campaign_id
        WHERE m.status = 'queued' AND m.due_at <= $1 AND c.status = 'sending' AND ($2 OR s.rule = 'all')
        ORDER BY m.due_at, m.id
        LIMIT 1`,
      [now(), repliesOk],
    );
    const due = rows[0];
    if (!due) break;

    const skip =
      due.suppressed ? 'Unsubscribed' :
      due.rule === 'not_replied' && due.replied_at ? 'Already replied' :
      due.rule === 'replied' && !due.replied_at ? 'Has not replied' :
      null;
    if (skip) {
      await c.query(`UPDATE team_mail.messages SET status = 'skipped', error = $2 WHERE id = $1 AND status = 'queued'`, [due.id, skip]);
      result.skipped++;
      continue;
    }

    const claimed = await c.query(
      `UPDATE team_mail.messages SET status = 'sending', claimed_at = $2, attempts = attempts + 1
        WHERE id = $1 AND status = 'queued' RETURNING attempts`,
      [due.id, now()],
    );
    if (!claimed.rowCount) continue;
    const attempts: number = claimed.rows[0].attempts;

    try {
      const email = composeEmail(due, due.data, sender, `${opts.publicUrl}/unsubscribe/${due.unsub_token}`);
      const outgoing = { to: due.email, subject: email.subject, html: email.html, fragment: email.fragment };
      const sent =
        due.position > 0 && due.as_reply && due.thread_message_id
          ? await opts.mailer.reply(due.thread_message_id, { ...outgoing, subject: due.subject.trim() ? email.subject : '' })
          : await opts.mailer.send(outgoing);
      await recordSent(c, due, sent, now());
      result.sent++;
      remaining--;
    } catch (err) {
      const e = err instanceof MailError ? err : new MailError(err instanceof Error ? err.message : String(err), 'rejected');
      stop = await recordFailure(c, due, attempts, e, now(), result);
    }
    if (!stop && remaining > 0) await sleep(pauseMs);
  }

  await c.query(
    `UPDATE team_mail.campaigns c SET status = 'completed', completed_at = $1
      WHERE status = 'sending'
        AND NOT EXISTS (SELECT 1 FROM team_mail.messages m WHERE m.campaign_id = c.id AND m.status IN ('queued', 'sending'))`,
    [now()],
  );

  if (!stop && remaining > 0) {
    const { rows } = await c.query(
      `SELECT 1 FROM team_mail.messages m JOIN team_mail.steps s ON s.id = m.step_id JOIN team_mail.campaigns c ON c.id = m.campaign_id
        WHERE m.status = 'queued' AND m.due_at <= $1 AND c.status = 'sending' AND ($2 OR s.rule = 'all') LIMIT 1`,
      [now(), repliesOk],
    );
    result.more = rows.length > 0;
  }
  return result;
}

async function recordSent(c: PoolClient, due: Due, sent: { messageId: string; conversationId: string | null }, at: Date) {
  await c.query('BEGIN');
  try {
    await c.query(`UPDATE team_mail.messages SET status = 'sent', sent_at = $2, error = NULL WHERE id = $1`, [due.id, at]);
    if (due.position === 0) {
      await c.query(
        `UPDATE team_mail.recipients SET thread_message_id = $2, conversation_id = $3, first_sent_at = $4 WHERE id = $1`,
        [due.recipient_id, sent.messageId, sent.conversationId, at],
      );
    }
    // Queue the next follow-up for this person, timed from this email.
    await c.query(
      `INSERT INTO team_mail.messages (campaign_id, step_id, recipient_id, due_at)
       SELECT s.campaign_id, s.id, $2, $4::timestamptz + make_interval(days => s.delay_days)
         FROM team_mail.steps s WHERE s.campaign_id = $1 AND s.position = $3 + 1
       ON CONFLICT DO NOTHING`,
      [due.campaign_id, due.recipient_id, due.position, at],
    );
    await c.query('UPDATE team_mail.campaigns SET consecutive_failures = 0 WHERE id = $1', [due.campaign_id]);
    await c.query('COMMIT');
  } catch (err) {
    await c.query('ROLLBACK').catch(() => {});
    throw err;
  }
}

// Returns true when the run should stop.
async function recordFailure(c: PoolClient, due: Due, attempts: number, e: MailError, at: Date, result: RunResult): Promise<boolean> {
  const requeue = (seconds: number, undoAttempt = false) =>
    c.query(
      `UPDATE team_mail.messages SET status = 'queued', due_at = $2::timestamptz + make_interval(secs => $3), error = $4,
              attempts = attempts - $5 WHERE id = $1`,
      [due.id, at, seconds, e.message, undoAttempt ? 1 : 0],
    );

  if (e.kind === 'auth') {
    // Nothing will send until the connection is fixed: pause every campaign.
    await requeue(0, true);
    await c.query(
      `UPDATE team_mail.campaigns SET status = 'paused', error = $1 WHERE status IN ('sending', 'scheduled')`,
      [`Paused: Microsoft 365 refused to send (${e.message}). Fix the connection, then resume.`],
    );
    result.error = e.message;
    return true;
  }
  if (e.kind === 'throttled') {
    await requeue(e.retryAfterSeconds, true);
    return true;
  }
  if (e.kind === 'transient' && attempts < MAX_ATTEMPTS) {
    await requeue(300 * attempts);
    return false;
  }

  await c.query(`UPDATE team_mail.messages SET status = 'failed', error = $2 WHERE id = $1`, [due.id, e.message]);
  result.failed++;
  const { rows } = await c.query(
    `UPDATE team_mail.campaigns SET consecutive_failures = consecutive_failures + 1 WHERE id = $1 RETURNING consecutive_failures`,
    [due.campaign_id],
  );
  if (rows[0]?.consecutive_failures >= MAX_CONSECUTIVE_FAILURES) {
    await c.query(`UPDATE team_mail.campaigns SET status = 'paused', error = $2 WHERE id = $1 AND status = 'sending'`, [
      due.campaign_id,
      `Paused after ${MAX_CONSECUTIVE_FAILURES} failed emails in a row. Last error: ${e.message}`,
    ]);
  }
  return false;
}

// Marks people as replied when mail arrives from their address, or in the
// thread of an email they were sent, after their first campaign email.
async function scanReplies(c: PoolClient, mailer: Mailer, scannedAt: Date | null, now: () => Date) {
  const { rows: [{ first }] } = await c.query(
    `SELECT min(first_sent_at) AS first FROM team_mail.recipients
      WHERE first_sent_at > $1::timestamptz - interval '60 days' AND replied_at IS NULL`,
    [now()],
  );
  if (!first) return;
  // Overlap a little with the last scan: mail can be stamped slightly late.
  const since = new Date(Math.max(new Date(first).getTime(), (scannedAt ? new Date(scannedAt).getTime() : 0) - 10 * 60_000));
  const scanStart = now();
  const { messages, more } = await mailer.received(since);
  const replies = messages.filter((m) => isHumanReply(m, mailer.mailbox));
  if (replies.length) {
    await c.query(
      `UPDATE team_mail.recipients r SET replied_at = x.at
         FROM (SELECT * FROM unnest($1::text[], $2::text[], $3::timestamptz[]) AS t(sender, conversation, at)) x
        WHERE r.replied_at IS NULL AND r.first_sent_at <= x.at
          AND (r.email = x.sender OR (x.conversation IS NOT NULL AND r.conversation_id = x.conversation))`,
      [replies.map((m) => m.from), replies.map((m) => m.conversationId), replies.map((m) => m.receivedAt)],
    );
  }
  // When the page limit cut the scan short, continue from the last one read.
  const through = more && messages.length ? messages[messages.length - 1].receivedAt : scanStart;
  await c.query('UPDATE team_mail.settings SET replies_scanned_at = $1', [through]);
}
