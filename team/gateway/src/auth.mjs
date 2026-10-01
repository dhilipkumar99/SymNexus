// Email + password sign-in, session tokens, and the account rules shared by the
// server and the admin CLI.

import { hashToken } from './db.mjs';
import { burnVerification, hashPassword, validatePassword, verifyPassword } from './passwords.mjs';
import { RateLimiter } from './ratelimit.mjs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normaliseEmail(email) {
	return typeof email === 'string' ? email.trim().toLowerCase() : '';
}

export function validateEmail(email, allowedDomains = []) {
	if (!EMAIL_RE.test(email) || email.length > 254) return 'Enter a valid email address.';
	const domain = email.split('@')[1];
	if (allowedDomains.length && !allowedDomains.includes(domain)) {
		return `Only ${allowedDomains.map((d) => '@' + d).join(', ')} addresses can have accounts.`;
	}
	return null;
}

export function validateName(name) {
	const n = typeof name === 'string' ? name.trim() : '';
	if (n.length < 1 || n.length > 100) return 'Name must be 1 to 100 characters.';
	return null;
}

// The identity Burst sees. external_id is the immutable account id, so
// changing an employee's email or name never splits their history in Burst.
export function burstIdentity(account) {
	const local = account.email.split('@')[0].replace(/[^a-z0-9._-]/g, '').slice(0, 32) || 'user';
	return {
		consumer: `sx:${account.id}`,
		groups: account.role === 'admin' ? 'admin' : 'member',
		claims: JSON.stringify({ name: account.name, email: account.email, preferred_username: local }),
	};
}

export class Auth {
	constructor(db, config) {
		this.db = db;
		this.config = config;
		// 20 attempts per address and 8 failures per email, each per 15 minutes.
		this.ipLimiter = new RateLimiter({ limit: 20, windowMs: 15 * 60_000 });
		this.emailLimiter = new RateLimiter({ limit: 8, windowMs: 15 * 60_000 });
		// Resolved sessions cached briefly so each API call doesn't hit the
		// database. Logout, deactivation and password changes clear the cache.
		this.cache = new Map();
		this.cacheMs = 10_000;
	}

	sweep() {
		this.ipLimiter.sweep();
		this.emailLimiter.sweep();
		const t = Date.now();
		for (const [k, v] of this.cache) if (v.expiresAt <= t) this.cache.delete(k);
	}

	// Returns { token, account } or { error, status, retryAfter? }.
	async login({ email, password, ip, userAgent }) {
		const addr = normaliseEmail(email);
		const ipWait = this.ipLimiter.blockedFor(`ip:${ip}`);
		const emailWait = this.emailLimiter.blockedFor(`email:${addr}`);
		if (ipWait || emailWait) {
			return { status: 429, error: 'Too many sign-in attempts. Try again later.', retryAfter: Math.max(ipWait, emailWait) };
		}
		this.ipLimiter.hit(`ip:${ip}`);

		const account = addr ? await this.db.findAccountByEmail(addr) : null;
		const ok = account
			? await verifyPassword(password, account.password_hash)
			: await burnVerification(password);

		if (!ok || !account.active) {
			this.emailLimiter.hit(`email:${addr}`);
			return { status: 400, error: 'Invalid email or password.' };
		}

		this.emailLimiter.reset(`email:${addr}`);
		const token = await this.db.createSession(account.id, { maxSeconds: this.config.sessionMaxSeconds, userAgent, ip });
		await this.db.touchLogin(account.id);
		return { token, account };
	}

	// The account behind a bearer token, or null.
	async authenticate(token) {
		if (typeof token !== 'string' || token.length < 20 || token.length > 200) return null;
		const key = hashToken(token).toString('hex');
		const hit = this.cache.get(key);
		if (hit && hit.expiresAt > Date.now()) return hit.account;
		const account = await this.db.resolveSession(token, this.config.sessionIdleSeconds);
		if (account) this.cache.set(key, { account, expiresAt: Date.now() + this.cacheMs });
		else this.cache.delete(key);
		return account;
	}

	async logout(token) {
		if (typeof token !== 'string') return;
		this.cache.delete(hashToken(token).toString('hex'));
		await this.db.revokeSession(token);
	}

	// Changes the password after re-checking the current one, and signs out
	// every other session for the account.
	async changePassword({ email, currentPassword, newPassword, ip }) {
		const login = await this.login({ email, password: currentPassword, ip, userAgent: 'password-change' });
		if (login.error) return login;
		const problem = validatePassword(newPassword);
		if (problem) {
			await this.db.revokeSession(login.token);
			return { status: 400, error: problem };
		}
		if (newPassword === currentPassword) {
			await this.db.revokeSession(login.token);
			return { status: 400, error: 'Choose a password different from the current one.' };
		}
		await this.db.setPassword(login.account.id, await hashPassword(newPassword));
		await this.db.revokeAccountSessions(login.account.id);
		this.cache.clear();
		return { ok: true };
	}
}
