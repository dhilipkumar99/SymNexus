'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { audit, createSessionValue, SESSION_COOKIE, sessionCookieOptions, consumePasswordLink, validatePassword } from '@/lib/auth';
import { clientIp } from '@/lib/request';

export async function setPassword(_prev: { error: string }, form: FormData) {
  const token = form.get('token')?.toString() ?? '';
  const password = form.get('password')?.toString() ?? '';
  if (password !== (form.get('confirm')?.toString() ?? '')) return { error: 'The passwords do not match.' };
  const problem = validatePassword(password);
  if (problem) return { error: problem };

  const account = await consumePasswordLink(token, password);
  if (!account) return { error: 'This link has expired or was already used. Ask an admin for a new one.' };

  await audit({ id: account.id, email: account.email }, 'account.password_set', account.email, null, await clientIp());
  (await cookies()).set(SESSION_COOKIE, createSessionValue(account), sessionCookieOptions);
  redirect('/');
}
