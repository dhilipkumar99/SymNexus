// Serves the built Burst SPA: hashed assets cached for a year, index.html for
// every client-side route, and /env.js generated from configuration.

import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';

const TYPES = {
	'.html': 'text/html; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8',
	'.mjs': 'text/javascript; charset=utf-8',
	'.css': 'text/css; charset=utf-8',
	'.json': 'application/json',
	'.svg': 'image/svg+xml',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.ico': 'image/x-icon',
	'.webp': 'image/webp',
	'.woff2': 'font/woff2',
	'.webmanifest': 'application/manifest+json',
	'.txt': 'text/plain; charset=utf-8',
};

export function securityHeaders(config) {
	const headers = {
		'content-security-policy': [
			"default-src 'self'",
			"script-src 'self'",
			"style-src 'self' 'unsafe-inline'",
			"img-src 'self' data: blob:",
			"media-src 'self' blob:",
			"font-src 'self' data:",
			"connect-src 'self'",
			"object-src 'none'",
			"base-uri 'self'",
			"form-action 'self'",
			"frame-ancestors 'none'",
		].join('; '),
		'x-content-type-options': 'nosniff',
		'x-frame-options': 'DENY',
		'referrer-policy': 'no-referrer',
		'permissions-policy': 'camera=(), microphone=(), geolocation=()',
		'cross-origin-opener-policy': 'same-origin',
	};
	if (config.hsts) headers['strict-transport-security'] = 'max-age=31536000; includeSubDomains';
	return headers;
}

export function envJs() {
	// The SPA's local credential form posts to /oauth/burst/token, which this
	// gateway answers. No external identity provider is configured.
	return `window.__BURST_ENV__ = ${JSON.stringify({ LOGIN_LOCAL: 'true' })};\n`;
}

export async function serveStatic(req, res, config) {
	const root = path.resolve(config.publicDir);
	let pathname;
	try {
		pathname = decodeURIComponent(new URL(req.url, 'http://x').pathname);
	} catch {
		res.writeHead(400).end();
		return;
	}
	let file = path.resolve(root, '.' + pathname);
	if (file !== root && !file.startsWith(root + path.sep)) {
		res.writeHead(404).end();
		return;
	}

	let info = await stat(file).catch(() => null);
	const isAsset = Boolean(info?.isFile()) && pathname !== '/index.html';
	if (!info?.isFile()) {
		// Unknown paths with an extension are real 404s; the rest are SPA routes.
		if (path.extname(pathname)) {
			res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end('Not found');
			return;
		}
		file = path.join(root, 'index.html');
		info = await stat(file).catch(() => null);
		if (!info) {
			res.writeHead(503, { 'content-type': 'text/plain; charset=utf-8' }).end('App not built');
			return;
		}
	}

	const headers = {
		'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream',
		'content-length': info.size,
		'cache-control':
			isAsset && pathname.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'no-cache',
	};
	res.writeHead(200, headers);
	if (req.method === 'HEAD') return res.end();
	createReadStream(file).pipe(res);
}
