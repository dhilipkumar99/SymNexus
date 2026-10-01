// Account storage: the `team_auth` schema in the same Postgres database as
// Burst (Burst's migrations never touch it). Created on first use.

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
