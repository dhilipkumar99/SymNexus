import assert from 'node:assert/strict';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import http from 'node:http';
import net from 'node:net';
import { after, before, describe, test } from 'node:test';
import { Auth, burstIdentity, validateEmail } from '../src/auth.mjs';
import { hashPassword, verifyPassword, validatePassword, generatePassword } from '../src/passwords.mjs';
import { upstreamHeaders, upstreamPath } from '../src/proxy.mjs';
import { RateLimiter } from '../src/ratelimit.mjs';
import { createServer } from '../src/server.mjs';

// ── In-memory stand-in for Db ──────────────────────────────────────────────
const sha = (t) => createHash('sha256').update(t).digest('hex');
class MemoryDb {
	accounts = new Map();
	sessions = new Map();
	async findAccountByEmail(email) {
		return [...this.accounts.values()].find((a) => a.email === email) ?? null;
	}
	async createAccount({ email, name, passwordHash, role }) {
		const id = randomUUID();
		this.accounts.set(id, { id, email, name, password_hash: passwordHash, role, active: true });
		return id;
	}
	async setPassword(id, hash) {
		this.accounts.get(id).password_hash = hash;
	}
	async updateAccount(id, fields) {
		Object.assign(this.accounts.get(id), fields);
	}
	async touchLogin() {}
	async createSession(accountId, { maxSeconds }) {
		const token = randomBytes(32).toString('base64url');
		this.sessions.set(sha(token), { accountId, expiresAt: Date.now() + maxSeconds * 1000 });
		return token;
	}
	async resolveSession(token) {
		const s = this.sessions.get(sha(token));
		const a = s && this.accounts.get(s.accountId);
		if (!s || !a || !a.active || s.expiresAt < Date.now()) return null;
		return { id: a.id, email: a.email, name: a.name, role: a.role };
	}
	async revokeSession(token) {
		this.sessions.delete(sha(token));
	}
	async revokeAccountSessions(accountId) {
		for (const [k, s] of this.sessions) if (s.accountId === accountId) this.sessions.delete(k);
	}
}

const listen = (server) =>
	new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server.address().port)));

// ── Unit tests ─────────────────────────────────────────────────────────────
describe('passwords', () => {
	test('hash verifies and rejects a wrong password', async () => {
		const h = await hashPassword('correct horse battery');
		assert.ok(h.startsWith('scrypt$'));
		assert.equal(await verifyPassword('correct horse battery', h), true);
		assert.equal(await verifyPassword('correct horse batterz', h), false);
		assert.equal(await verifyPassword('x', 'garbage'), false);
	});
	test('policy and generator', () => {
		assert.ok(validatePassword('short'));
		assert.equal(validatePassword('twelve chars'), null);
		const p = generatePassword();
		assert.equal(p.length, 20);
		assert.equal(validatePassword(p), null);
	});
});

describe('rate limiter', () => {
	test('blocks after the limit until the window resets', () => {
		let t = 0;
		const rl = new RateLimiter({ limit: 2, windowMs: 1000, now: () => t });
		rl.hit('k');
		rl.hit('k');
		assert.equal(rl.blockedFor('k'), 1);
		t = 1000;
		assert.equal(rl.blockedFor('k'), 0);
	});
});

describe('identity and header scrubbing', () => {
	test('burst identity uses the immutable id', () => {
		const id = burstIdentity({ id: 'abc', email: 'jane.doe@symnexus.co', name: 'Jane Doe', role: 'admin' });
		assert.equal(id.consumer, 'sx:abc');
		assert.equal(id.groups, 'admin');
		assert.deepEqual(JSON.parse(id.claims), { name: 'Jane Doe', email: 'jane.doe@symnexus.co', preferred_username: 'jane.doe' });
	});
	test('client X-Auth headers, Authorization and access_token never reach Burst', () => {
		const req = {
			headers: { 'x-auth-consumer': 'evil', 'X-Auth-Claims': '{}', authorization: 'Bearer t', cookie: 'a=b', accept: 'x' },
			socket: {},
			clientIp: '1.2.3.4',
		};
		const h = upstreamHeaders(req, null);
		assert.equal(h['x-auth-consumer'], undefined);
		assert.equal(h['x-auth-claims'], undefined);
		assert.equal(h.authorization, undefined);
		assert.equal(h.cookie, undefined);
		assert.equal(h.accept, 'x');
		assert.equal(upstreamPath('/ws?access_token=abc&x=1'), '/ws?x=1');
	});
	test('email domain allow-list', () => {
		assert.equal(validateEmail('a@symnexus.co', ['symnexus.co']), null);
		assert.ok(validateEmail('a@gmail.com', ['symnexus.co']));
		assert.ok(validateEmail('not-an-email'));
	});
});

// ── End to end against a fake Burst ────────────────────────────────────────
describe('gateway server', () => {
	let db, auth, gateway, upstream, base, port, seen;
	const upgraded = [];
	const config = {
		upstream: null,
		publicDir: '/nonexistent',
		sessionIdleSeconds: 3600,
		sessionMaxSeconds: 3600,
		allowedEmailDomains: [],
		trustProxy: false,
		hsts: false,
		appName: 'Test',
	};

	before(async () => {
		seen = [];
		upstream = http.createServer((req, res) => {
			seen.push({ url: req.url, headers: req.headers });
			res.writeHead(200, { 'content-type': 'application/json' });
			res.end('{"ok":true}');
		});
		upstream.on('upgrade', (req, socket) => {
			seen.push({ url: req.url, headers: req.headers, upgrade: true, socket });
			upgraded.push(socket);
			socket.write('HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\n\r\n');
			socket.on('data', (d) => socket.write(d)); // echo
			socket.on('end', () => socket.end()); // close when the peer does, as Burst does
		});
		config.upstream = new URL(`http://127.0.0.1:${await listen(upstream)}`);
		db = new MemoryDb();
		auth = new Auth(db, config);
		await db.createAccount({
			email: 'jane@symnexus.co',
			name: 'Jane',
			passwordHash: await hashPassword('a strong passphrase'),
			role: 'member',
		});
		gateway = createServer({ config, db, auth });
		port = await listen(gateway);
		base = `http://127.0.0.1:${port}`;
	});
	after(async () => {
		for (const s of upgraded) s.destroy();
		gateway.closeAllConnections();
		upstream.closeAllConnections();
		await new Promise((r) => gateway.close(r));
		await new Promise((r) => upstream.close(r));
	});

	const login = (username, password) =>
		fetch(`${base}/oauth/burst/token`, {
			method: 'POST',
			headers: { 'content-type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams({ grant_type: 'password', username, password, client_id: 'burst' }),
		});

	test('rejects bad credentials with a generic error', async () => {
		const r1 = await login('jane@symnexus.co', 'wrong password!!');
		const r2 = await login('nobody@symnexus.co', 'wrong password!!');
		assert.equal(r1.status, 400);
		assert.equal(r2.status, 400);
		assert.deepEqual(await r1.json(), await r2.json());
	});

	test('API requires a session', async () => {
		const r = await fetch(`${base}/api/users/me`, { headers: { 'x-auth-consumer': 'admin' } });
		assert.equal(r.status, 401);
		assert.equal(seen.length, 0);
	});

	test('signs in, proxies with verified identity, and signs out', async () => {
		const r = await login('Jane@SymNexus.co', 'a strong passphrase');
		assert.equal(r.status, 200);
		const { access_token: token } = await r.json();

		const me = await fetch(`${base}/api/users/me`, {
			headers: { authorization: `Bearer ${token}`, 'x-auth-consumer': 'spoofed', 'x-auth-consumer-groups': 'admin' },
		});
		assert.equal(me.status, 200);
		const last = seen.at(-1);
		assert.match(last.headers['x-auth-consumer'], /^sx:/);
		assert.equal(last.headers['x-auth-consumer-groups'], 'member');
		assert.equal(last.headers.authorization, undefined);
		assert.ok(me.headers.get('content-security-policy'));

		const out = await fetch(`${base}/oauth/burst/logout`, { method: 'POST', headers: { authorization: `Bearer ${token}` } });
		assert.equal(out.status, 204);
		const after = await fetch(`${base}/api/users/me`, { headers: { authorization: `Bearer ${token}` } });
		assert.equal(after.status, 401);
	});

	test('websocket upgrade is authenticated and token is stripped', async () => {
		const { access_token: token } = await (await login('jane@symnexus.co', 'a strong passphrase')).json();

		const handshake = (path) =>
			new Promise((resolve) => {
				const sock = net.connect(port, '127.0.0.1', () => {
					sock.write(
						`GET ${path} HTTP/1.1\r\nHost: x\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==\r\nSec-WebSocket-Version: 13\r\n\r\n`,
					);
				});
				let buf = '';
				sock.on('data', (d) => {
					buf += d;
					if (buf.includes('\r\n\r\n')) {
						if (buf.startsWith('HTTP/1.1 101')) {
							sock.write('ping');
							sock.once('data', (echo) => {
								resolve({ status: 101, echo: String(echo) });
								sock.destroy();
							});
						} else {
							resolve({ status: Number(buf.slice(9, 12)) });
							sock.destroy();
						}
					}
				});
			});

		assert.equal((await handshake('/ws')).status, 401);
		const ok = await handshake(`/ws?access_token=${token}`);
		assert.equal(ok.status, 101);
		assert.equal(ok.echo, 'ping');
		const up = seen.findLast((s) => s.upgrade);
		assert.equal(up.url, '/ws');
		assert.match(up.headers['x-auth-consumer'], /^sx:/);
		// The client went away, so the gateway must close the upstream side too.
		await new Promise((resolve, reject) => {
			if (up.socket.destroyed || up.socket.readableEnded) return resolve();
			up.socket.once('end', resolve);
			up.socket.once('close', resolve);
			setTimeout(() => reject(new Error('upstream socket left open')), 2000);
		});
	});

	test('deactivated accounts lose access', async () => {
		const { access_token: token } = await (await login('jane@symnexus.co', 'a strong passphrase')).json();
		const account = await db.findAccountByEmail('jane@symnexus.co');
		await db.updateAccount(account.id, { active: false });
		auth.cache.clear();
		const r = await fetch(`${base}/api/users/me`, { headers: { authorization: `Bearer ${token}` } });
		assert.equal(r.status, 401);
		await db.updateAccount(account.id, { active: true });
	});

	test('password change revokes sessions', async () => {
		const { access_token: token } = await (await login('jane@symnexus.co', 'a strong passphrase')).json();
		const r = await fetch(`${base}/account`, {
			method: 'POST',
			headers: { 'content-type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams({
				email: 'jane@symnexus.co',
				current_password: 'a strong passphrase',
				new_password: 'another strong passphrase',
			}),
		});
		assert.equal(r.status, 200);
		const old = await fetch(`${base}/api/users/me`, { headers: { authorization: `Bearer ${token}` } });
		assert.equal(old.status, 401);
		assert.equal((await login('jane@symnexus.co', 'another strong passphrase')).status, 200);
	});

	test('rate limits repeated failures for one email', async () => {
		let last;
		for (let i = 0; i < 9; i++) last = await login('ratelimit@symnexus.co', 'wrong password!!');
		assert.equal(last.status, 429);
		assert.ok(last.headers.get('retry-after'));
	});
});
