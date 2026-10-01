// Account administration for the SymNexus Team gateway.
//
//   node src/cli.mjs add <email> <name...> [--admin] [--password-stdin]
//   node src/cli.mjs reset-password <email> [--password-stdin]
//   node src/cli.mjs role <email> admin|member
//   node src/cli.mjs deactivate <email>
//   node src/cli.mjs activate <email>
//   node src/cli.mjs sign-out <email>
//   node src/cli.mjs list
//
// Without --password-stdin a random password is generated and printed once;
// hand it to the employee over a secure channel and ask them to change it at /account.

import { pathToFileURL } from 'node:url';
import { normaliseEmail, validateEmail, validateName } from './auth.mjs';
import { loadConfig } from './config.mjs';
import { Db } from './db.mjs';
import { generatePassword, hashPassword, validatePassword } from './passwords.mjs';

class UsageError extends Error {}

async function readStdin() {
	const chunks = [];
	for await (const c of process.stdin) chunks.push(c);
	return Buffer.concat(chunks).toString('utf8').replace(/\r?\n$/, '');
}

async function choosePassword(flags) {
	if (!flags.has('--password-stdin')) return { password: generatePassword(), generated: true };
	const password = await readStdin();
	const problem = validatePassword(password);
	if (problem) throw new UsageError(problem);
	return { password, generated: false };
}

async function requireAccount(db, email) {
	const account = await db.findAccountByEmail(normaliseEmail(email));
	if (!account) throw new UsageError(`No account for ${email}.`);
	return account;
}

export async function run(argv, { db, config, out = console.log }) {
	const flags = new Set(argv.filter((a) => a.startsWith('--')));
	const [command, ...args] = argv.filter((a) => !a.startsWith('--'));

	switch (command) {
		case 'add': {
			const [rawEmail, ...nameParts] = args;
			const email = normaliseEmail(rawEmail);
			const name = nameParts.join(' ').trim();
			const problem = validateEmail(email, config.allowedEmailDomains) ?? validateName(name);
			if (problem) throw new UsageError(problem);
			if (await db.findAccountByEmail(email)) throw new UsageError(`${email} already has an account.`);
			const { password, generated } = await choosePassword(flags);
			await db.createAccount({
				email,
				name,
				passwordHash: await hashPassword(password),
				role: flags.has('--admin') ? 'admin' : 'member',
			});
			out(`Created ${flags.has('--admin') ? 'admin' : 'member'} account for ${name} <${email}>.`);
			if (generated) out(`Temporary password (shown once): ${password}`);
			return;
		}
		case 'reset-password': {
			const account = await requireAccount(db, args[0]);
			const { password, generated } = await choosePassword(flags);
			await db.setPassword(account.id, await hashPassword(password));
			await db.revokeAccountSessions(account.id);
			out(`Password reset for ${account.email}; all of their sessions were signed out.`);
			if (generated) out(`Temporary password (shown once): ${password}`);
			return;
		}
		case 'role': {
			const account = await requireAccount(db, args[0]);
			if (!['admin', 'member'].includes(args[1])) throw new UsageError('Role must be admin or member.');
			await db.updateAccount(account.id, { role: args[1] });
			out(`${account.email} is now ${args[1]}. It applies on their next request.`);
			return;
		}
		case 'deactivate':
		case 'activate': {
			const account = await requireAccount(db, args[0]);
			await db.updateAccount(account.id, { active: command === 'activate' });
			if (command === 'deactivate') await db.revokeAccountSessions(account.id);
			out(`${account.email} ${command === 'activate' ? 'can sign in again' : 'is deactivated and signed out everywhere'}.`);
			return;
		}
		case 'sign-out': {
			const account = await requireAccount(db, args[0]);
			await db.revokeAccountSessions(account.id);
			out(`Signed ${account.email} out of every session.`);
			return;
		}
		case 'list': {
			const rows = await db.listAccounts();
			if (rows.length === 0) return out('No accounts yet. Create the first with: add <email> <name> --admin');
			for (const r of rows) {
				const last = r.last_login_at ? r.last_login_at.toISOString().slice(0, 16).replace('T', ' ') : 'never';
				out(
					`${r.active ? ' ' : 'x'} ${r.email.padEnd(36)} ${r.role.padEnd(7)} sessions:${String(r.active_sessions).padStart(3)}  last sign-in: ${last}  ${r.name}`,
				);
			}
			return;
		}
		default:
			throw new UsageError(
				'Commands: add <email> <name> [--admin] [--password-stdin] | reset-password <email> | role <email> admin|member | deactivate <email> | activate <email> | sign-out <email> | list',
			);
	}
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
	const config = loadConfig();
	const db = new Db(config.databaseUrl);
	db.migrate()
		.then(() => run(process.argv.slice(2), { db, config }))
		.catch((err) => {
			console.error(err instanceof UsageError ? err.message : err);
			process.exitCode = 1;
		})
		.finally(() => db.close());
}
