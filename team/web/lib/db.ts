// Account storage (the `team_auth` schema), email campaigns (`team_mail`) and
// the team tools (`team_work`: CRM, tasks, wiki),
// in the same Postgres database as Burst (Burst's migrations never touch them).
// Created on first use.

import pg from 'pg';

const SCHEMA = `
CREATE SCHEMA IF NOT EXISTS team_auth;

CREATE TABLE IF NOT EXISTS team_auth.accounts (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email           text NOT NULL UNIQUE CHECK (email = lower(email)),
    name            text NOT NULL,
    role            text NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
    password_hash   text,
    session_version integer NOT NULL DEFAULT 1,
    active          boolean NOT NULL DEFAULT true,
    created_at      timestamptz NOT NULL DEFAULT now(),
    created_by      uuid REFERENCES team_auth.accounts(id) ON DELETE SET NULL,
    last_login_at   timestamptz
);
-- Exactly one master admin (Slack's Primary Owner).
CREATE UNIQUE INDEX IF NOT EXISTS one_owner ON team_auth.accounts ((true)) WHERE role = 'owner';

-- Single-use links to set a password: invitations and password resets.
CREATE TABLE IF NOT EXISTS team_auth.password_links (
    token_hash  bytea PRIMARY KEY,
    account_id  uuid NOT NULL REFERENCES team_auth.accounts(id) ON DELETE CASCADE,
    purpose     text NOT NULL CHECK (purpose IN ('invite', 'reset')),
    expires_at  timestamptz NOT NULL,
    created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS team_auth.audit_log (
    id          bigserial PRIMARY KEY,
    at          timestamptz NOT NULL DEFAULT now(),
    actor_id    uuid,
    actor_email text,
    action      text NOT NULL,
    target_email text,
    detail      jsonb,
    ip          text
);
CREATE INDEX IF NOT EXISTS audit_log_at ON team_auth.audit_log (at DESC);

-- Failed sign-in counters, shared by every function instance.
CREATE TABLE IF NOT EXISTS team_auth.throttle (
    key       text PRIMARY KEY,
    failures  integer NOT NULL,
    reset_at  timestamptz NOT NULL
);

-- Email campaigns, sent from the shared Microsoft 365 mailbox (lib/mail).
CREATE SCHEMA IF NOT EXISTS team_mail;

-- One row: what every campaign email carries, and the dispatcher's state.
CREATE TABLE IF NOT EXISTS team_mail.settings (
    id                 boolean PRIMARY KEY DEFAULT true CHECK (id),
    from_name          text NOT NULL DEFAULT 'SymNexus',
    signature          text NOT NULL DEFAULT '',
    footer             text NOT NULL DEFAULT '',
    daily_limit        integer NOT NULL DEFAULT 300 CHECK (daily_limit BETWEEN 1 AND 10000),
    replies_scanned_at timestamptz,
    lease_owner        text,
    lease_until        timestamptz,
    last_run_at        timestamptz,
    last_run_error     text,
    updated_at         timestamptz NOT NULL DEFAULT now(),
    updated_by         text
);
INSERT INTO team_mail.settings DEFAULT VALUES ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS team_mail.templates (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name        text NOT NULL,
    subject     text NOT NULL,
    body        text NOT NULL,
    created_by  text,
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_by  text,
    updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS team_mail.campaigns (
    id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name                 text NOT NULL,
    status               text NOT NULL DEFAULT 'draft'
                         CHECK (status IN ('draft', 'scheduled', 'sending', 'paused', 'completed', 'stopped')),
    columns              jsonb NOT NULL,
    start_at             timestamptz,
    started_at           timestamptz,
    completed_at         timestamptz,
    error                text,
    consecutive_failures integer NOT NULL DEFAULT 0,
    created_by           text NOT NULL,
    created_at           timestamptz NOT NULL DEFAULT now()
);

-- The emails of a campaign: position 0 is the first, then follow-ups. Subject
-- and body are copied from the template, so later edits to it change nothing.
CREATE TABLE IF NOT EXISTS team_mail.steps (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id   uuid NOT NULL REFERENCES team_mail.campaigns(id) ON DELETE CASCADE,
    position      integer NOT NULL,
    template_name text NOT NULL,
    subject       text NOT NULL,
    body          text NOT NULL,
    delay_days    integer NOT NULL DEFAULT 0,
    rule          text NOT NULL DEFAULT 'all' CHECK (rule IN ('all', 'not_replied', 'replied')),
    as_reply      boolean NOT NULL DEFAULT true,
    UNIQUE (campaign_id, position)
);

CREATE TABLE IF NOT EXISTS team_mail.recipients (
    id                bigserial PRIMARY KEY,
    campaign_id       uuid NOT NULL REFERENCES team_mail.campaigns(id) ON DELETE CASCADE,
    email             text NOT NULL CHECK (email = lower(email)),
    data              jsonb NOT NULL,
    unsub_token       text NOT NULL UNIQUE,
    thread_message_id text,
    conversation_id   text,
    first_sent_at     timestamptz,
    replied_at        timestamptz,
    UNIQUE (campaign_id, email)
);
CREATE INDEX IF NOT EXISTS recipients_email ON team_mail.recipients (email);
CREATE INDEX IF NOT EXISTS recipients_conversation ON team_mail.recipients (conversation_id) WHERE conversation_id IS NOT NULL;

-- One row per email to one person. Follow-ups are added when the previous
-- email to that person is sent.
CREATE TABLE IF NOT EXISTS team_mail.messages (
    id           bigserial PRIMARY KEY,
    campaign_id  uuid NOT NULL REFERENCES team_mail.campaigns(id) ON DELETE CASCADE,
    step_id      uuid NOT NULL REFERENCES team_mail.steps(id) ON DELETE CASCADE,
    recipient_id bigint NOT NULL REFERENCES team_mail.recipients(id) ON DELETE CASCADE,
    status       text NOT NULL DEFAULT 'queued'
                 CHECK (status IN ('queued', 'sending', 'sent', 'failed', 'skipped', 'cancelled')),
    due_at       timestamptz NOT NULL,
    claimed_at   timestamptz,
    sent_at      timestamptz,
    attempts     integer NOT NULL DEFAULT 0,
    error        text,
    UNIQUE (step_id, recipient_id)
);
CREATE INDEX IF NOT EXISTS messages_due ON team_mail.messages (due_at) WHERE status = 'queued';
CREATE INDEX IF NOT EXISTS messages_sent ON team_mail.messages (sent_at) WHERE status = 'sent';
CREATE INDEX IF NOT EXISTS messages_campaign ON team_mail.messages (campaign_id, status);

-- People who unsubscribed or were excluded by hand: never emailed again.
CREATE TABLE IF NOT EXISTS team_mail.suppressions (
    email      text PRIMARY KEY CHECK (email = lower(email)),
    reason     text NOT NULL CHECK (reason IN ('unsubscribed', 'manual')),
    created_at timestamptz NOT NULL DEFAULT now(),
    created_by text
);

-- Team tools (lib/work): the CRM, the task board and the wiki.
CREATE SCHEMA IF NOT EXISTS team_work;

-- People and organizations we sell to, and where each stands in the pipeline.
CREATE TABLE IF NOT EXISTS team_work.contacts (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name          text NOT NULL,
    email         text CHECK (email = lower(email)),
    phone         text NOT NULL DEFAULT '',
    organization  text NOT NULL DEFAULT '',
    title         text NOT NULL DEFAULT '',
    stage         text NOT NULL DEFAULT 'lead'
                  CHECK (stage IN ('lead', 'contacted', 'qualified', 'proposal', 'won', 'lost')),
    source        text NOT NULL DEFAULT '',
    value_usd     integer CHECK (value_usd >= 0),
    owner_id      uuid REFERENCES team_auth.accounts(id) ON DELETE SET NULL,
    next_step     text NOT NULL DEFAULT '',
    next_step_on  date,
    created_by    text NOT NULL,
    created_at    timestamptz NOT NULL DEFAULT now(),
    updated_at    timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS contacts_email ON team_work.contacts (email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS contacts_stage ON team_work.contacts (stage, updated_at DESC);

-- The history of a contact: notes, calls, meetings, form submissions and stage changes.
CREATE TABLE IF NOT EXISTS team_work.activities (
    id          bigserial PRIMARY KEY,
    contact_id  uuid NOT NULL REFERENCES team_work.contacts(id) ON DELETE CASCADE,
    kind        text NOT NULL CHECK (kind IN ('note', 'call', 'email', 'meeting', 'form', 'stage')),
    body        text NOT NULL,
    author      text NOT NULL,
    at          timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS activities_contact ON team_work.activities (contact_id, at DESC);

CREATE TABLE IF NOT EXISTS team_work.tasks (
    id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title        text NOT NULL,
    notes        text NOT NULL DEFAULT '',
    status       text NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'doing', 'done')),
    assignee_id  uuid REFERENCES team_auth.accounts(id) ON DELETE SET NULL,
    due_on       date,
    contact_id   uuid REFERENCES team_work.contacts(id) ON DELETE SET NULL,
    created_by   text NOT NULL,
    created_at   timestamptz NOT NULL DEFAULT now(),
    updated_at   timestamptz NOT NULL DEFAULT now(),
    done_at      timestamptz
);
CREATE INDEX IF NOT EXISTS tasks_status ON team_work.tasks (status, due_on);

CREATE TABLE IF NOT EXISTS team_work.pages (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    slug        text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
    title       text NOT NULL,
    body        text NOT NULL DEFAULT '',
    updated_by  text NOT NULL,
    updated_at  timestamptz NOT NULL DEFAULT now(),
    created_at  timestamptz NOT NULL DEFAULT now()
);
`;

declare global {
  // Survives module reloads in development; one pool per function instance.
  var __teamPool: pg.Pool | undefined;
  var __teamSchema: Promise<void> | undefined;
}

export function pool(): pg.Pool {
  if (!globalThis.__teamPool) {
    const connectionString = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
    if (!connectionString) throw new Error('DATABASE_URL is not set');
    const p = new pg.Pool({ connectionString, max: 5, idleTimeoutMillis: 10_000 });
    p.on('error', (err) => console.error('[team] idle database client error:', err.message));
    globalThis.__teamPool = p;
  }
  return globalThis.__teamPool;
}

async function ensureSchema(): Promise<void> {
  const client = await pool().connect();
  try {
    await client.query('SELECT pg_advisory_lock(727002)');
    await client.query(SCHEMA);
  } finally {
    await client.query('SELECT pg_advisory_unlock(727002)').catch(() => {});
    client.release();
  }
}

export async function db(): Promise<pg.Pool> {
  globalThis.__teamSchema ??= ensureSchema().catch((err) => {
    globalThis.__teamSchema = undefined;
    throw err;
  });
  await globalThis.__teamSchema;
  return pool();
}
