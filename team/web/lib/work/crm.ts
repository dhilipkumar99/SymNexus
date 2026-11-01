// The CRM: contacts, their place in the sales pipeline, and their history.
//
//   lead ─> contacted ─> qualified ─> proposal ─> won
//                 (any stage) ──────────────────> lost
//
// Every signed-in employee can use it; deleting a contact is for admins and is
// written to the audit log. Website form submissions arrive through
// /api/leads (recordLead) and land as leads, or as a note on an existing contact.

import { isAdmin, type Result } from '../accounts.ts';
import { audit, type Session } from '../auth.ts';
import { db } from '../db.ts';
import { normalizeEmail } from '../mail/csv.ts';
import { ACTIVITY_KINDS, STAGE_LABEL, STAGES, type ActivityKind, type Stage } from './labels.ts';
export { ACTIVITY_KINDS, ACTIVITY_LABEL, STAGE_LABEL, STAGES, type ActivityKind, type Stage } from './labels.ts';

export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const fail = (error: string) => ({ ok: false as const, error });

export interface Contact {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  organization: string;
  title: string;
  stage: Stage;
  source: string;
  valueUsd: number | null;
  ownerId: string | null;
  ownerName: string | null;
  nextStep: string;
  nextStepOn: string | null; // YYYY-MM-DD
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Activity {
  id: string;
  kind: ActivityKind;
  body: string;
  author: string;
  at: Date;
}

export interface ContactInput {
  name: string;
  email: string;
  phone: string;
  organization: string;
  title: string;
  stage: string;
  source: string;
  value: string;
  ownerId: string;
  nextStep: string;
  nextStepOn: string;
}

const SELECT = `
  SELECT c.id, c.name, c.email, c.phone, c.organization, c.title, c.stage, c.source, c.value_usd,
         c.owner_id, a.name AS owner_name, c.next_step, to_char(c.next_step_on, 'YYYY-MM-DD') AS next_step_on,
         c.created_by, c.created_at, c.updated_at
    FROM team_work.contacts c
    LEFT JOIN team_auth.accounts a ON a.id = c.owner_id`;

function toContact(r: Record<string, unknown>): Contact {
  return {
    id: r.id as string,
    name: r.name as string,
    email: r.email as string | null,
    phone: r.phone as string,
    organization: r.organization as string,
    title: r.title as string,
    stage: r.stage as Stage,
    source: r.source as string,
    valueUsd: r.value_usd as number | null,
    ownerId: r.owner_id as string | null,
    ownerName: r.owner_name as string | null,
    nextStep: r.next_step as string,
    nextStepOn: r.next_step_on as string | null,
    createdBy: r.created_by as string,
    createdAt: r.created_at as Date,
    updatedAt: r.updated_at as Date,
  };
}

// Checks and tidies a contact form. Returns the values to store, or an error.
function clean(input: ContactInput): Result<{
  v: {
    name: string;
    email: string | null;
    phone: string;
    organization: string;
    title: string;
    stage: Stage;
    source: string;
    value: number | null;
    ownerId: string | null;
    nextStep: string;
    nextStepOn: string | null;
  };
}> {
  const t = (s: string, max: number) => s.trim().replace(/\s+/g, ' ').slice(0, max);
  const name = t(input.name, 120);
  if (!name) return fail('Enter a name.');
  let email: string | null = null;
  if (input.email.trim()) {
    email = normalizeEmail(input.email);
    if (!email) return fail('Enter a valid email address, or leave it blank.');
  }
  const stage = (STAGES as readonly string[]).includes(input.stage) ? (input.stage as Stage) : 'lead';
  let value: number | null = null;
  const rawValue = input.value.replace(/[$,\s]/g, '');
  if (rawValue) {
    value = Number(rawValue);
    if (!Number.isInteger(value) || value < 0 || value > 2_000_000_000) return fail('Enter the deal value as a whole number of dollars.');
  }
  if (input.ownerId && !UUID_RE.test(input.ownerId)) return fail('Choose an owner from the list.');
  if (input.nextStepOn && !DATE_RE.test(input.nextStepOn)) return fail('Enter the next-step date as a date.');
  return {
    ok: true,
    v: {
      name,
      email,
      phone: t(input.phone, 40),
      organization: t(input.organization, 160),
      title: t(input.title, 120),
      stage,
      source: t(input.source, 80),
      value,
      ownerId: input.ownerId || null,
      nextStep: t(input.nextStep, 300),
      nextStepOn: input.nextStepOn || null,
    },
  };
}

const duplicate = (err: unknown) => (err as { code?: string }).code === '23505';

export async function listContacts(filter: { stage?: string; q?: string; owner?: string } = {}): Promise<Contact[]> {
  const where: string[] = [];
  const args: unknown[] = [];
  if (filter.stage && (STAGES as readonly string[]).includes(filter.stage)) {
    args.push(filter.stage);
    where.push(`c.stage = $${args.length}`);
  }
  if (filter.owner && UUID_RE.test(filter.owner)) {
    args.push(filter.owner);
    where.push(`c.owner_id = $${args.length}`);
  }
  const q = filter.q?.trim();
  if (q) {
    args.push(`%${q.replace(/[\\%_]/g, (m) => '\\' + m)}%`);
    const n = args.length;
    where.push(`(c.name ILIKE $${n} OR c.email ILIKE $${n} OR c.organization ILIKE $${n} OR c.title ILIKE $${n})`);
  }
  const { rows } = await (await db()).query(
    `${SELECT} ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
      ORDER BY c.next_step_on ASC NULLS LAST, c.updated_at DESC
      LIMIT 1000`,
    args,
  );
  return rows.map(toContact);
}

// Contacts and open value per stage, for the pipeline summary.
export async function pipelineSummary(): Promise<Record<Stage, { count: number; value: number }>> {
  const { rows } = await (await db()).query(
    'SELECT stage, count(*)::int AS count, coalesce(sum(value_usd), 0)::bigint AS value FROM team_work.contacts GROUP BY stage',
  );
  const out = Object.fromEntries(STAGES.map((s) => [s, { count: 0, value: 0 }])) as Record<Stage, { count: number; value: number }>;
  for (const r of rows) out[r.stage as Stage] = { count: r.count, value: Number(r.value) };
  return out;
}

export async function getContact(id: string): Promise<{ contact: Contact; activities: Activity[] } | null> {
  if (!UUID_RE.test(id)) return null;
  const pool = await db();
  const { rows } = await pool.query(`${SELECT} WHERE c.id = $1`, [id]);
  if (!rows[0]) return null;
  const acts = await pool.query(
    'SELECT id, kind, body, author, at FROM team_work.activities WHERE contact_id = $1 ORDER BY at DESC, id DESC LIMIT 500',
    [id],
  );
  return { contact: toContact(rows[0]), activities: acts.rows.map((a) => ({ ...a, id: String(a.id) })) };
}

export async function createContact(actor: Session, input: ContactInput): Promise<Result<{ id: string }>> {
  const r = clean(input);
  if (!r.ok) return r;
  const v = r.v;
  try {
    const { rows } = await (await db()).query(
      `INSERT INTO team_work.contacts (name, email, phone, organization, title, stage, source, value_usd, owner_id, next_step, next_step_on, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id`,
      [v.name, v.email, v.phone, v.organization, v.title, v.stage, v.source, v.value, v.ownerId, v.nextStep, v.nextStepOn, actor.email],
    );
    return { ok: true, id: rows[0].id };
  } catch (err) {
    if (duplicate(err)) return fail(`${v.email} is already in the CRM.`);
    throw err;
  }
}

export async function updateContact(actor: Session, id: string, input: ContactInput): Promise<Result> {
  if (!UUID_RE.test(id)) return fail('Contact not found.');
  const r = clean(input);
  if (!r.ok) return r;
  const v = r.v;
  const client = await (await db()).connect();
  try {
    await client.query('BEGIN');
    const before = await client.query('SELECT stage FROM team_work.contacts WHERE id = $1 FOR UPDATE', [id]);
    if (!before.rows[0]) {
      await client.query('ROLLBACK');
      return fail('Contact not found.');
    }
    await client.query(
      `UPDATE team_work.contacts
          SET name = $2, email = $3, phone = $4, organization = $5, title = $6, stage = $7, source = $8,
              value_usd = $9, owner_id = $10, next_step = $11, next_step_on = $12, updated_at = now()
        WHERE id = $1`,
      [id, v.name, v.email, v.phone, v.organization, v.title, v.stage, v.source, v.value, v.ownerId, v.nextStep, v.nextStepOn],
    );
    const from = before.rows[0].stage as Stage;
    if (from !== v.stage) {
      await client.query("INSERT INTO team_work.activities (contact_id, kind, body, author) VALUES ($1, 'stage', $2, $3)", [
        id,
        `${STAGE_LABEL[from]} → ${STAGE_LABEL[v.stage]}`,
        actor.name,
      ]);
    }
    await client.query('COMMIT');
    return { ok: true };
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    if (duplicate(err)) return fail(`${v.email} is already in the CRM.`);
    throw err;
  } finally {
    client.release();
  }
}

export async function setStage(actor: Session, id: string, stage: string): Promise<Result> {
  if (!UUID_RE.test(id)) return fail('Contact not found.');
  if (!(STAGES as readonly string[]).includes(stage)) return fail('Unknown stage.');
  // One statement: change the stage and record the move, only if it moved.
  await (await db()).query(
    `WITH old AS (SELECT id, stage FROM team_work.contacts WHERE id = $1 FOR UPDATE),
          moved AS (
            UPDATE team_work.contacts c SET stage = $2, updated_at = now()
              FROM old WHERE c.id = old.id AND old.stage <> $2
            RETURNING old.stage AS from_stage)
     INSERT INTO team_work.activities (contact_id, kind, body, author)
     SELECT $1, 'stage', (($3::jsonb) ->> from_stage) || ' → ' || ($3::jsonb ->> $2), $4 FROM moved`,
    [id, stage, JSON.stringify(STAGE_LABEL), actor.name],
  );
  return { ok: true };
}

export async function addActivity(actor: Session, contactId: string, kind: string, body: string): Promise<Result> {
  if (!UUID_RE.test(contactId)) return fail('Contact not found.');
  if (!(ACTIVITY_KINDS as readonly string[]).includes(kind)) return fail('Choose what kind of entry this is.');
  const text = body.replace(/\r\n/g, '\n').trim();
  if (!text || text.length > 10000) return fail('Write the note (up to 10,000 characters).');
  const pool = await db();
  const r = await pool.query(
    `WITH touched AS (UPDATE team_work.contacts SET updated_at = now() WHERE id = $1 RETURNING id)
     INSERT INTO team_work.activities (contact_id, kind, body, author) SELECT id, $2, $3, $4 FROM touched`,
    [contactId, kind, text, actor.name],
  );
  return r.rowCount ? { ok: true } : fail('Contact not found.');
}

export async function deleteActivity(actor: Session, id: string): Promise<Result> {
  if (!/^\d+$/.test(id)) return fail('Entry not found.');
  // Authors can remove their own notes; admins any. Form submissions and stage changes stay.
  const { rowCount } = await (await db()).query(
    `DELETE FROM team_work.activities WHERE id = $1 AND kind NOT IN ('form', 'stage') AND (author = $2 OR $3)`,
    [id, actor.name, isAdmin(actor)],
  );
  return rowCount ? { ok: true } : fail('You can only remove your own notes.');
}

export async function deleteContact(actor: Session, id: string, ip: string): Promise<Result> {
  if (!isAdmin(actor)) return fail('Only admins can delete contacts.');
  if (!UUID_RE.test(id)) return fail('Contact not found.');
  const { rows } = await (await db()).query('DELETE FROM team_work.contacts WHERE id = $1 RETURNING name, email', [id]);
  if (!rows[0]) return fail('Contact not found.');
  await audit(actor, 'crm.contact_deleted', rows[0].email, { name: rows[0].name }, ip);
  return { ok: true };
}

// ── Website leads ───────────────────────────────────────────────────────────

export interface LeadInput {
  source?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  organization?: string;
  role?: string;
  subject?: string;
  product?: string;
  orgType?: string;
  message?: string;
}

// A form submission from symnexus.co. New addresses become leads; a known
// address gets the submission as a note, and a lost contact reopens as a lead.
export async function recordLead(input: LeadInput): Promise<Result<{ id: string; created: boolean }>> {
  const s = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
  const email = normalizeEmail(s(input.email, 254));
  if (!email) return fail('A valid email is required.');
  const name = [s(input.firstName, 60), s(input.lastName, 60)].filter(Boolean).join(' ') || email;
  const source = s(input.source, 80) || 'Website';
  const details = [
    ['Subject', s(input.subject, 150)],
    ['Product of interest', s(input.product, 100)],
    ['Organization type', s(input.orgType, 100)],
    ['Phone', s(input.phone, 40)],
  ]
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`);
  const body = [`${source}`, ...details, '', s(input.message, 5000)].join('\n').trim();

  const client = await (await db()).connect();
  try {
    await client.query('BEGIN');
    const inserted = await client.query(
      `INSERT INTO team_work.contacts (name, email, phone, organization, title, source, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, 'website')
       ON CONFLICT (email) WHERE email IS NOT NULL DO NOTHING
       RETURNING id`,
      [name, email, s(input.phone, 40), s(input.organization, 160), s(input.role, 120), source],
    );
    let id: string = inserted.rows[0]?.id;
    const created = Boolean(id);
    if (!id) {
      const existing = await client.query(
        `UPDATE team_work.contacts
            SET stage = CASE WHEN stage = 'lost' THEN 'lead' ELSE stage END,
                phone = CASE WHEN phone = '' THEN $2 ELSE phone END,
                organization = CASE WHEN organization = '' THEN $3 ELSE organization END,
                title = CASE WHEN title = '' THEN $4 ELSE title END,
                updated_at = now()
          WHERE email = $1 RETURNING id`,
        [email, s(input.phone, 40), s(input.organization, 160), s(input.role, 120)],
      );
      id = existing.rows[0].id;
    }
    await client.query("INSERT INTO team_work.activities (contact_id, kind, body, author) VALUES ($1, 'form', $2, 'Website')", [id, body]);
    await client.query('COMMIT');
    return { ok: true, id, created };
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}

// ── Export ──────────────────────────────────────────────────────────────────

const csvCell = (v: string) => {
  // Neutralise spreadsheet formulas, then quote when needed.
  const safe = /^[=+\-@\t\r]/.test(v) ? `'${v}` : v;
  return /[",\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
};

// A CSV the campaign tool can import directly (first_name, email, ...).
export function contactsCsv(contacts: Contact[]): string {
  const header = ['first_name', 'last_name', 'name', 'email', 'organization', 'title', 'phone', 'stage', 'source', 'owner'];
  const lines = [header.join(',')];
  for (const c of contacts) {
    const [first, ...rest] = c.name.split(' ');
    lines.push(
      [first, rest.join(' '), c.name, c.email ?? '', c.organization, c.title, c.phone, STAGE_LABEL[c.stage], c.source, c.ownerName ?? '']
        .map(csvCell)
        .join(','),
    );
  }
  return lines.join('\r\n') + '\r\n';
}
