// Runtime configuration, read once from the environment. Every value has a safe
// default except DATABASE_URL, which the gateway cannot run without.

function int(name, fallback) {
	const raw = process.env[name];
	if (raw === undefined || raw === '') return fallback;
	const n = Number.parseInt(raw, 10);
	if (!Number.isFinite(n) || n <= 0) throw new Error(`${name} must be a positive integer`);
	return n;
}

function list(name) {
	return (process.env[name] ?? '')
		.split(',')
		.map((s) => s.trim().toLowerCase())
		.filter(Boolean);
}

export function loadConfig() {
	const databaseUrl = process.env.DATABASE_URL;
	if (!databaseUrl) throw new Error('DATABASE_URL is required');

	return {
		databaseUrl,
		listen: { host: process.env.GATEWAY_HOST ?? '0.0.0.0', port: int('GATEWAY_PORT', 8080) },
		// Where Burst listens. It must not be reachable from anywhere but this gateway.
		upstream: new URL(process.env.BURST_UPSTREAM_URL ?? 'http://burst:3000'),
		// Built SPA served to the browser.
		publicDir: process.env.GATEWAY_PUBLIC_DIR ?? new URL('../public', import.meta.url).pathname,
		// Sessions: a token is dropped after this long without use, and after the
		// absolute lifetime whatever happens.
		sessionIdleSeconds: int('SESSION_IDLE_SECONDS', 12 * 60 * 60),
		sessionMaxSeconds: int('SESSION_MAX_SECONDS', 7 * 24 * 60 * 60),
		// Accounts may only be created for these email domains (empty = any).
		allowedEmailDomains: list('ALLOWED_EMAIL_DOMAINS'),
		// Behind a TLS-terminating proxy, trust its X-Forwarded-For for rate limiting.
		trustProxy: process.env.TRUST_PROXY === 'true',
		// Send HSTS. Enable once the site is served only over HTTPS.
		hsts: process.env.HSTS === 'true',
		appName: process.env.APP_NAME ?? 'SymNexus Team',
	};
}
