// Accounts and sessions live in their own `gateway` schema, in the same
// PostgreSQL database as Burst, so Burst's migrations never touch them.

import { createHash, randomBytes, randomUUID } from 'node:crypto';
import pg from 'pg';

const SCHEMA = `
CREATE SCHEMA IF NOT EXISTS gateway;

CREATE TABLE IF NOT EXISTS gateway.accounts (
    id            uuid PRIMARY KEY,
    email         text NOT NULL UNIQUE CHECK (email = lower(email)),
    name          text NOT NULL,
    password_hash text NOT NULL,
    role          text NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'admin')),
    active        boolean NOT NULL DEFAULT true,
    created_at    timestamptz NOT NULL DEFAULT now(),
    updated_at    timestamptz NOT NULL DEFAULT now(),
    last_login_at timestamptz
);

CREATE TABLE IF NOT EXISTS gateway.sessions (
    token_hash   bytea PRIMARY KEY,
    account_id   uuid NOT NULL REFERENCES gateway.accounts(id) ON DELETE CASCADE,
    created_at   timestamptz NOT NULL DEFAULT now(),
    last_used_at timestamptz NOT NULL DEFAULT now(),
    expires_at   timestamptz NOT NULL,
    user_agent   text,
    ip           text
);

CREATE INDEX IF NOT EXISTS sessions_account_idx ON gateway.sessions (account_id);
CREATE INDEX IF NOT EXISTS sessions_expires_idx ON gateway.sessions (expires_at);
`;

export function hashToken(token) {
	return createHash('sha256').update(token).digest();
}

export class Db {
	constructor(databaseUrl) {
		this.pool = new pg.Pool({ connectionString: databaseUrl, max: 10 });
		// An idle client losing its connection (database restart) must not crash
		// the gateway; the pool replaces it on the next query.
		this.pool.on('error', (err) => console.error('[gateway] idle database client error:', err.message));
	}

	async migrate() {
		// Serialise concurrent gateway starts on an advisory lock.
		const client = await this.pool.connect();
		try {
			await client.query('SELECT pg_advisory_lock(727001)');
			await client.query(SCHEMA);
		} finally {
			await client.query('SELECT pg_advisory_unlock(727001)').catch(() => {});
			client.release();
		}
	}

	close() {
		return this.pool.end();
	}

	// ── Accounts ────────────────────────────────────────────────────────────

	async findAccountByEmail(email) {
		const { rows } = await this.pool.query('SELECT * FROM gateway.accounts WHERE email = $1', [email]);
		return rows[0] ?? null;
	}

	async listAccounts() {
		const { rows } = await this.pool.query(
			`SELECT a.id, a.email, a.name, a.role, a.active, a.created_at, a.last_login_at,
			        count(s.token_hash) FILTER (WHERE s.expires_at > now()) AS active_sessions
			   FROM gateway.accounts a
			   LEFT JOIN gateway.sessions s ON s.account_id = a.id
			  GROUP BY a.id
			  ORDER BY a.email`,
		);
		return rows;
	}

	async createAccount({ email, name, passwordHash, role }) {
		const id = randomUUID();
		await this.pool.query(
			'INSERT INTO gateway.accounts (id, email, name, password_hash, role) VALUES ($1, $2, $3, $4, $5)',
			[id, email, name, passwordHash, role],
		);
		return id;
	}

	async setPassword(accountId, passwordHash) {
		await this.pool.query('UPDATE gateway.accounts SET password_hash = $2, updated_at = now() WHERE id = $1', [
			accountId,
			passwordHash,
		]);
	}

	async updateAccount(accountId, fields) {
		const allowed = ['name', 'role', 'active'];
		const keys = Object.keys(fields).filter((k) => allowed.includes(k));
		if (keys.length === 0) return;
		const sets = keys.map((k, i) => `${k} = $${i + 2}`).join(', ');
		await this.pool.query(`UPDATE gateway.accounts SET ${sets}, updated_at = now() WHERE id = $1`, [
			accountId,
			...keys.map((k) => fields[k]),
		]);
	}

	async touchLogin(accountId) {
		await this.pool.query('UPDATE gateway.accounts SET last_login_at = now() WHERE id = $1', [accountId]);
	}

	// ── Sessions ────────────────────────────────────────────────────────────

	// Returns the bearer token. Only its SHA-256 is stored, so a database leak
	// does not hand out usable sessions.
	async createSession(accountId, { maxSeconds, userAgent, ip }) {
		const token = randomBytes(32).toString('base64url');
		await this.pool.query(
			`INSERT INTO gateway.sessions (token_hash, account_id, expires_at, user_agent, ip)
			 VALUES ($1, $2, now() + make_interval(secs => $3), $4, $5)`,
			[hashToken(token), accountId, maxSeconds, userAgent?.slice(0, 300) ?? null, ip ?? null],
		);
		return token;
	}

	// The session and its account, if the token is live: not expired, used
	// within the idle window, and the account still active. Refreshes last_used_at.
	async resolveSession(token, idleSeconds) {
		const { rows } = await this.pool.query(
			`UPDATE gateway.sessions s
			    SET last_used_at = now()
			   FROM gateway.accounts a
			  WHERE s.token_hash = $1
			    AND a.id = s.account_id
			    AND a.active
			    AND s.expires_at > now()
			    AND s.last_used_at > now() - make_interval(secs => $2)
			 RETURNING a.id, a.email, a.name, a.role`,
			[hashToken(token), idleSeconds],
		);
		return rows[0] ?? null;
	}

	async revokeSession(token) {
		await this.pool.query('DELETE FROM gateway.sessions WHERE token_hash = $1', [hashToken(token)]);
	}

	async revokeAccountSessions(accountId, exceptToken = null) {
		await this.pool.query(
			'DELETE FROM gateway.sessions WHERE account_id = $1 AND ($2::bytea IS NULL OR token_hash <> $2)',
			[accountId, exceptToken ? hashToken(exceptToken) : null],
		);
	}

	async purgeExpiredSessions(idleSeconds) {
		await this.pool.query(
			`DELETE FROM gateway.sessions
			  WHERE expires_at < now() OR last_used_at < now() - make_interval(secs => $1)`,
			[idleSeconds],
		);
	}
}
