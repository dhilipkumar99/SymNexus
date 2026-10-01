// Manage SymNexus Team accounts (the TEAM_ACCOUNTS environment variable).
//
//   npm run accounts -- add <email> <name...> [--admin]
//   npm run accounts -- reset-password <email>
//   npm run accounts -- role <email> admin|member
//   npm run accounts -- remove <email>
//   npm run accounts -- list
//   npm run accounts -- push            # upload to Vercel (production) and redeploy
//
// Edits .team-accounts.json (git-ignored; holds password hashes, never
// passwords). New and reset passwords are generated and printed once: pass them
// to the employee privately. Changes take effect after `push`. Removing an
// account or resetting its password signs that person out everywhere.

import { execFileSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { hashPassword, loadAccounts, type Account } from '../lib/auth.ts';

const FILE = join(import.meta.dirname, '..', '.team-accounts.json');
const ALLOWED_DOMAINS = (process.env.ALLOWED_EMAIL_DOMAINS ?? 'symnexus.co').split(',').map((d) => d.trim().toLowerCase());

function read(): Account[] {
  if (!existsSync(FILE)) return [];
  return [...loadAccounts(readFileSync(FILE, 'utf8')).values()];
}

function write(accounts: Account[]) {
  accounts.sort((a, b) => a.email.localeCompare(b.email));
  writeFileSync(FILE, JSON.stringify(accounts, null, 2) + '\n', { mode: 0o600 });
}

function generatePassword(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let out = '';
  for (const b of randomBytes(64)) {
    if (b < 224) out += alphabet[b % 56];
    if (out.length === 20) return out;
  }
  return generatePassword();
}

function find(accounts: Account[], email: string): Account {
  const a = accounts.find((x) => x.email === email.trim().toLowerCase());
  if (!a) throw new Error(`No account for ${email}.`);
  return a;
}

const PUSH_HINT = 'Run `npm run accounts -- push` to apply this to the live site.';

async function main(argv: string[]) {
  const flags = new Set(argv.filter((a) => a.startsWith('--')));
  const [command, ...args] = argv.filter((a) => !a.startsWith('--'));
  const accounts = read();

  switch (command) {
    case 'add': {
      const email = (args[0] ?? '').trim().toLowerCase();
      const name = args.slice(1).join(' ').trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Usage: add <email> <name...> [--admin]');
      if (!ALLOWED_DOMAINS.includes(email.split('@')[1])) throw new Error(`Only ${ALLOWED_DOMAINS.join(', ')} addresses.`);
      if (!name) throw new Error('A name is required.');
      if (accounts.some((a) => a.email === email)) throw new Error(`${email} already has an account.`);
      const password = generatePassword();
      accounts.push({ email, name, role: flags.has('--admin') ? 'admin' : 'member', password: await hashPassword(password) });
      write(accounts);
      console.log(`Added ${name} <${email}>${flags.has('--admin') ? ' as admin' : ''}.`);
      console.log(`Temporary password (shown once): ${password}`);
      console.log(PUSH_HINT);
      return;
    }
    case 'reset-password': {
      const a = find(accounts, args[0] ?? '');
      const password = generatePassword();
      a.password = await hashPassword(password);
      write(accounts);
      console.log(`New password for ${a.email} (shown once): ${password}`);
      console.log(PUSH_HINT);
      return;
    }
    case 'role': {
      const a = find(accounts, args[0] ?? '');
      if (args[1] !== 'admin' && args[1] !== 'member') throw new Error('Usage: role <email> admin|member');
      a.role = args[1];
      write(accounts);
      console.log(`${a.email} is now ${a.role}. ${PUSH_HINT}`);
      return;
    }
    case 'remove': {
      const a = find(accounts, args[0] ?? '');
      write(accounts.filter((x) => x !== a));
      console.log(`Removed ${a.email}. ${PUSH_HINT}`);
      return;
    }
    case 'list': {
      if (!accounts.length) return console.log('No accounts yet: npm run accounts -- add you@symnexus.co "Your Name" --admin');
      for (const a of accounts) console.log(`${a.email.padEnd(36)} ${a.role.padEnd(7)} ${a.name}`);
      return;
    }
    case 'push': {
      if (!accounts.length) throw new Error('No accounts to push.');
      const json = JSON.stringify(accounts);
      const cwd = join(import.meta.dirname, '..', '..');
      try {
        execFileSync('vercel', ['env', 'rm', 'TEAM_ACCOUNTS', 'production', '--yes'], { cwd, stdio: 'ignore' });
      } catch {
        // not set yet
      }
      execFileSync('vercel', ['env', 'add', 'TEAM_ACCOUNTS', 'production'], { cwd, input: json, stdio: ['pipe', 'inherit', 'inherit'] });
      execFileSync('vercel', ['deploy', '--prod', '--yes'], { cwd, stdio: 'inherit' });
      console.log(`Pushed ${accounts.length} account(s) and redeployed.`);
      return;
    }
    default:
      throw new Error('Commands: add, reset-password, role, remove, list, push');
  }
}

main(process.argv.slice(2)).catch((err: Error) => {
  console.error(err.message);
  process.exitCode = 1;
});
