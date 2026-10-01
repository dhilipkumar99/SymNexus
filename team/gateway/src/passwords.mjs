// Password hashing with scrypt (Node's built-in implementation; no native
// dependencies). Stored format: scrypt$N$r$p$<salt b64url>$<hash b64url>, so the
// cost can be raised later without invalidating existing hashes.

import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';

const N = 2 ** 15;
const R = 8;
const P = 1;
const KEY_LEN = 64;

export const MIN_PASSWORD_LENGTH = 12;
export const MAX_PASSWORD_LENGTH = 256;

// scrypt needs 128 * N * r bytes; maxmem gives it headroom over Node's 32 MiB default.
function derive(password, salt, n, r, p) {
	return new Promise((resolve, reject) => {
		scrypt(password.normalize('NFKC'), salt, KEY_LEN, { N: n, r, p, maxmem: 128 * n * r * 2 }, (err, key) =>
			err ? reject(err) : resolve(key),
		);
	});
}

export function validatePassword(password) {
	if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
		return `Passwords must be at least ${MIN_PASSWORD_LENGTH} characters.`;
	}
	if (password.length > MAX_PASSWORD_LENGTH) {
		return `Passwords must be at most ${MAX_PASSWORD_LENGTH} characters.`;
	}
	return null;
}

export async function hashPassword(password) {
	const salt = randomBytes(16);
	const key = await derive(password, salt, N, R, P);
	return ['scrypt', N, R, P, salt.toString('base64url'), key.toString('base64url')].join('$');
}

export async function verifyPassword(password, stored) {
	const parts = typeof stored === 'string' ? stored.split('$') : [];
	if (parts.length !== 6 || parts[0] !== 'scrypt' || typeof password !== 'string' || password.length > MAX_PASSWORD_LENGTH) {
		return false;
	}
	const [, n, r, p, salt, hash] = parts;
	const expected = Buffer.from(hash, 'base64url');
	const key = await derive(password, Buffer.from(salt, 'base64url'), Number(n), Number(r), Number(p));
	return key.length === expected.length && timingSafeEqual(key, expected);
}

// Verified against when an email has no account, so a missing account costs the
// same time as a wrong password and response timing does not reveal which emails exist.
let dummyHash;
export async function burnVerification(password) {
	dummyHash ??= await hashPassword(randomBytes(24).toString('base64url'));
	await verifyPassword(typeof password === 'string' ? password : '', dummyHash);
	return false;
}

export function generatePassword() {
	// 20 characters from a 56-symbol alphabet without look-alikes (~116 bits).
	const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
	const bytes = randomBytes(40);
	let out = '';
	for (const b of bytes) {
		if (b < 224) out += alphabet[b % 56]; // 224 = 4 * 56: rejects bias
		if (out.length === 20) break;
	}
	return out.length === 20 ? out : generatePassword();
}
