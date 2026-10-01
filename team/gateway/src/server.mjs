// SymNexus Team gateway: the only public entry point to the Burst workspace.
//
//   POST /oauth/burst/token    email + password  -> session token
//   POST /oauth/burst/logout   revoke the presented session
//   GET|POST /account          change password
//   /api/*, /ws                authenticated proxy to Burst
//   /*                         the Burst web app

import http from 'node:http';
import { pathToFileURL } from 'node:url';
import { Auth, burstIdentity } from './auth.mjs';
import { loadConfig } from './config.mjs';
import { Db } from './db.mjs';
import { accountPage } from './pages.mjs';
import { closeProxy, proxyHttp, proxyUpgrade } from './proxy.mjs';
import { envJs, securityHeaders, serveStatic } from './static.mjs';

const MAX_FORM_BYTES = 8 * 1024;
const WEBHOOK_TRIGGER = /^\/api\/webhooks\/[^/]+\/trigger$/;

function clientIp(req, config) {
	if (config.trustProxy) {
		const forwarded = String(req.headers['x-forwarded-for'] ?? '')
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean);
		if (forwarded.length) return forwarded[forwarded.length - 1];
	}
	return req.socket.remoteAddress ?? 'unknown';
}

function bearerToken(req) {
	const header = req.headers.authorization ?? '';
	if (header.startsWith('Bearer ')) return header.slice(7).trim();
	// WebSockets, attachment downloads and emoji images carry the token in the
	// query string (RFC 6750 §2.3); the SPA has no way to set a header on them.
	return new URL(req.url, 'http://x').searchParams.get('access_token');
}

function readForm(req) {
	return new Promise((resolve, reject) => {
		const type = String(req.headers['content-type'] ?? '');
		if (!type.startsWith('application/x-www-form-urlencoded')) {
			reject(Object.assign(new Error('unsupported media type'), { status: 415 }));
			return;
		}
		let size = 0;
		const chunks = [];
		req.on('data', (c) => {
			size += c.length;
			if (size > MAX_FORM_BYTES) {
				reject(Object.assign(new Error('payload too large'), { status: 413 }));
				req.destroy();
				return;
			}
			chunks.push(c);
		});
		req.on('end', () => resolve(new URLSearchParams(Buffer.concat(chunks).toString('utf8'))));
		req.on('error', reject);
	});
}

function json(res, status, body, extra = {}) {
	res.writeHead(status, { 'content-type': 'application/json', 'cache-control': 'no-store', ...extra });
	res.end(JSON.stringify(body));
}

function problem(res, status, title, detail) {
	res.writeHead(status, { 'content-type': 'application/problem+json', 'cache-control': 'no-store' });
	res.end(JSON.stringify({ type: 'about:blank', title, status, ...(detail ? { detail } : {}) }));
}

export function createServer({ config, db, auth }) {
	const baseHeaders = securityHeaders(config);

	async function handle(req, res) {
		for (const [k, v] of Object.entries(baseHeaders)) res.setHeader(k, v);
		req.clientIp = clientIp(req, config);
		const { pathname } = new URL(req.url, 'http://x');

		if (pathname === '/healthz') return json(res, 200, { ok: true });

		if (pathname === '/env.js') {
			res.writeHead(200, { 'content-type': 'text/javascript; charset=utf-8', 'cache-control': 'no-cache' });
			return res.end(envJs());
		}

		if (pathname === '/oauth/burst/token') {
			if (req.method !== 'POST') return problem(res, 405, 'Method Not Allowed');
			const form = await readForm(req);
			if (form.get('grant_type') !== 'password') {
				return json(res, 400, { error: 'unsupported_grant_type' });
			}
			const result = await auth.login({
				email: form.get('username'),
				password: form.get('password') ?? '',
				ip: req.clientIp,
				userAgent: req.headers['user-agent'],
			});
			if (result.error) {
				const extra = result.retryAfter ? { 'retry-after': String(result.retryAfter) } : {};
				return json(res, result.status, { error: 'invalid_grant', error_description: result.error }, extra);
			}
			return json(res, 200, {
				access_token: result.token,
				token_type: 'Bearer',
				expires_in: config.sessionMaxSeconds,
			});
		}

		if (pathname === '/oauth/burst/logout') {
			if (req.method !== 'POST') return problem(res, 405, 'Method Not Allowed');
			await auth.logout(bearerToken(req));
			res.writeHead(204, { 'cache-control': 'no-store' });
			return res.end();
		}

		if (pathname === '/account') {
			res.setHeader('cache-control', 'no-store');
			if (req.method === 'GET') {
				res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
				return res.end(accountPage({ appName: config.appName }));
			}
			if (req.method !== 'POST') return problem(res, 405, 'Method Not Allowed');
			const form = await readForm(req);
			const email = form.get('email') ?? '';
			const result = await auth.changePassword({
				email,
				currentPassword: form.get('current_password') ?? '',
				newPassword: form.get('new_password') ?? '',
				ip: req.clientIp,
			});
			res.writeHead(result.error ? result.status : 200, { 'content-type': 'text/html; charset=utf-8' });
			return res.end(
				accountPage({ appName: config.appName, error: result.error, success: Boolean(result.ok), email }),
			);
		}

		if (pathname === '/api' || pathname.startsWith('/api/')) {
			// Incoming webhooks authenticate with their own secret, inside Burst.
			if (req.method === 'POST' && WEBHOOK_TRIGGER.test(pathname)) {
				return proxyHttp(req, res, config.upstream, null);
			}
			const account = await auth.authenticate(bearerToken(req));
			if (!account) return problem(res, 401, 'Unauthorized', 'Sign in again to continue.');
			return proxyHttp(req, res, config.upstream, burstIdentity(account));
		}

		if (req.method !== 'GET' && req.method !== 'HEAD') return problem(res, 405, 'Method Not Allowed');
		return serveStatic(req, res, config);
	}

	const server = http.createServer((req, res) => {
		handle(req, res).catch((err) => {
			const status = err?.status ?? 500;
			if (status === 500) console.error('[gateway] request failed:', err);
			if (!res.headersSent) problem(res, status, status === 500 ? 'Internal Server Error' : err.message);
			else res.destroy();
		});
	});

	server.on('upgrade', (req, socket, head) => {
		socket.on('error', () => socket.destroy());
		req.clientIp = clientIp(req, config);
		const { pathname } = new URL(req.url, 'http://x');
		if (pathname !== '/ws') {
			socket.end('HTTP/1.1 404 Not Found\r\nConnection: close\r\n\r\n');
			return;
		}
		auth
			.authenticate(bearerToken(req))
			.then((account) => {
				if (!account) {
					socket.end('HTTP/1.1 401 Unauthorized\r\nConnection: close\r\n\r\n');
					return;
				}
				proxyUpgrade(req, socket, head, config.upstream, burstIdentity(account));
			})
			.catch((err) => {
				console.error('[gateway] upgrade failed:', err);
				socket.end('HTTP/1.1 500 Internal Server Error\r\nConnection: close\r\n\r\n');
			});
	});

	server.on('close', closeProxy);
	server.headersTimeout = 20_000;
	server.requestTimeout = 0; // long-lived streams; uploads are bounded by Burst
	return server;
}

async function main() {
	const config = loadConfig();
	const db = new Db(config.databaseUrl);
	await db.migrate();
	const auth = new Auth(db, config);
	const server = createServer({ config, db, auth });

	const sweeper = setInterval(() => {
		auth.sweep();
		db.purgeExpiredSessions(config.sessionIdleSeconds).catch((e) => console.error('[gateway] purge failed:', e));
	}, 5 * 60_000);
	sweeper.unref();

	server.listen(config.listen.port, config.listen.host, () => {
		console.log(`[gateway] listening on ${config.listen.host}:${config.listen.port}, upstream ${config.upstream.origin}`);
	});

	const shutdown = () => {
		server.close(() => db.close().finally(() => process.exit(0)));
		setTimeout(() => process.exit(0), 10_000).unref();
	};
	process.on('SIGTERM', shutdown);
	process.on('SIGINT', shutdown);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
	main().catch((err) => {
		console.error('[gateway] failed to start:', err);
		process.exit(1);
	});
}
