// Master admin bootstrap and recovery. Needs DATABASE_URL (from `vercel env
// pull`) and TEAM_PUBLIC_URL (the site's address, for the printed link).
//
//   npm run owner -- create <email> <name...>   create the master admin (once)
//   npm run owner -- recover                    new set-password link for the master admin
//
// Prints a one-time link to set the password; it expires in 7 days (create) or
// 24 hours (recover). Everything else is managed in the app at /accounts.

import { createOwner, ownerRecoveryLink } from '../lib/accounts.ts';
import { pool } from '../lib/db.ts';

async function main([command, ...args]: string[]) {
  const base = (process.env.TEAM_PUBLIC_URL ?? '').replace(/\/$/, '');
  if (!base) throw new Error('Set TEAM_PUBLIC_URL, e.g. https://symnexus-team.vercel.app');

  if (command === 'create') {
    const [email, ...name] = args;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !name.length) throw new Error('Usage: create <email> <name...>');
    const r = await createOwner(email, name.join(' '));
    if (!r.ok) throw new Error(r.error);
    console.log(`Master admin created: ${email.toLowerCase()}`);
    console.log(`Set-password link (one use, 7 days): ${base}/setup/${r.token}`);
  } else if (command === 'recover') {
    const r = await ownerRecoveryLink();
    if (!r.ok) throw new Error(r.error);
    console.log(`Recovery link for ${r.email} (one use, 24 hours; all their sessions were ended): ${base}/setup/${r.token}`);
  } else {
    throw new Error('Commands: create <email> <name...> | recover');
  }
}

main(process.argv.slice(2))
  .catch((err: Error) => {
    console.error(err.message);
    process.exitCode = 1;
  })
  .finally(() => pool().end().catch(() => {}));
