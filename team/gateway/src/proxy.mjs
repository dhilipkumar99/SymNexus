// Reverse proxy to Burst for HTTP requests and WebSocket upgrades.
//
// Burst believes the X-Auth-* headers from this gateway only (its
// trusted_proxies setting), so every request is scrubbed of client-supplied
// X-Auth-* headers, Authorization and the access_token query parameter before
// the gateway adds the identity it verified itself.

import http from 'node:http';

const HOP_BY_HOP = new Set([
	'connection',
	'keep-alive',
	'proxy-authenticate',
	'proxy-authorization',
	'te',
	'trailer',
	'transfer-encoding',
	'upgrade',
]);

const agent = new http.Agent({ keepAlive: true, maxSockets: 256 });

// Drops pooled upstream connections; called when the gateway server closes.
export function closeProxy() {
	agent.destroy();
}

// Path and query to send upstream: access_token removed so it never reaches
// Burst's logs.
export function upstreamPath(rawUrl) {
	const url = new URL(rawUrl, 'http://x');
	url.searchParams.delete('access_token');
	const qs = url.searchParams.toString();
	return url.pathname + (qs ? `?${qs}` : '');
}

export function upstreamHeaders(req, identity, { keepUpgrade = false } = {}) {
	const out = {};
	const connectionTokens = new Set(
		(req.headers.connection ?? '')
			.split(',')
			.map((s) => s.trim().toLowerCase())
			.filter(Boolean),
	);
	for (const [name, value] of Object.entries(req.headers)) {
		const lower = name.toLowerCase();
		if (lower.startsWith('x-auth-') || lower === 'authorization' || lower === 'cookie') continue;
		if (lower === 'x-forwarded-for' || lower === 'x-real-ip' || lower === 'forwarded') continue;
		if (!keepUpgrade && (HOP_BY_HOP.has(lower) || connectionTokens.has(lower))) continue;
		out[lower] = value;
	}
	if (identity) {
		out['x-auth-consumer'] = identity.consumer;
		out['x-auth-consumer-groups'] = identity.groups;
		out['x-auth-claims'] = identity.claims;
	}
	out['x-forwarded-for'] = req.clientIp;
	out['x-forwarded-proto'] = req.socket.encrypted ? 'https' : (req.headers['x-forwarded-proto'] ?? 'http');
	return out;
}

export function proxyHttp(req, res, upstream, identity) {
	const upstreamReq = http.request(
		{
			hostname: upstream.hostname,
			port: upstream.port || 80,
			method: req.method,
			path: upstreamPath(req.url),
			headers: upstreamHeaders(req, identity),
			agent,
		},
		(upstreamRes) => {
			const headers = {};
			for (const [name, value] of Object.entries(upstreamRes.headers)) {
				if (!HOP_BY_HOP.has(name.toLowerCase())) headers[name] = value;
			}
			res.writeHead(upstreamRes.statusCode ?? 502, headers);
			upstreamRes.pipe(res);
		},
	);
	upstreamReq.setTimeout(120_000, () => upstreamReq.destroy(new Error('upstream timeout')));
	upstreamReq.on('error', () => {
		if (!res.headersSent) {
			res.writeHead(502, { 'content-type': 'application/problem+json' });
			res.end(JSON.stringify({ type: 'about:blank', title: 'Bad Gateway', status: 502 }));
		} else {
			res.destroy();
		}
	});
	req.pipe(upstreamReq);
}

export function proxyUpgrade(req, socket, head, upstream, identity) {
	const upstreamReq = http.request({
		hostname: upstream.hostname,
		port: upstream.port || 80,
		method: 'GET',
		path: upstreamPath(req.url),
		headers: upstreamHeaders(req, identity, { keepUpgrade: true }),
	});

	upstreamReq.on('upgrade', (upstreamRes, upstreamSocket, upstreamHead) => {
		const lines = [`HTTP/1.1 ${upstreamRes.statusCode} ${upstreamRes.statusMessage}`];
		for (let i = 0; i < upstreamRes.rawHeaders.length; i += 2) {
			lines.push(`${upstreamRes.rawHeaders[i]}: ${upstreamRes.rawHeaders[i + 1]}`);
		}
		socket.write(lines.join('\r\n') + '\r\n\r\n');
		if (upstreamHead?.length) socket.write(upstreamHead);
		if (head?.length) upstreamSocket.write(head);
		upstreamSocket.setNoDelay(true);
		socket.setNoDelay(true);
		upstreamSocket.pipe(socket).pipe(upstreamSocket);
		const close = () => {
			upstreamSocket.destroy();
			socket.destroy();
		};
		upstreamSocket.on('error', close);
		socket.on('error', close);
		upstreamSocket.on('close', close);
		socket.on('close', close);
	});

	// Upstream answered without upgrading (e.g. 401): relay that answer.
	upstreamReq.on('response', (upstreamRes) => {
		socket.write(`HTTP/1.1 ${upstreamRes.statusCode} ${upstreamRes.statusMessage}\r\nConnection: close\r\n\r\n`);
		socket.destroy();
	});
	upstreamReq.on('error', () => {
		socket.end('HTTP/1.1 502 Bad Gateway\r\nConnection: close\r\n\r\n');
	});
	upstreamReq.end();
}
