'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { changeOwnPassword, signOutEverywhere } from '@/lib/accounts';
import { createSessionValue, SESSION_COOKIE, sessionCookieOptions } from '@/lib/auth';
import { clientIp, currentSession } from '@/lib/request';

export interface FormState {
  ok: boolean;
  message: string;
}

export async function changePassword(_prev: FormState, form: FormData): Promise<FormState> {
  const session = await currentSession();
  if (!session) redirect('/login?next=/account');
  const next = form.get('new_password')?.toString() ?? '';
  if (next !== (form.get('confirm_password')?.toString() ?? '')) return { ok: false, message: 'The new passwords do not match.' };
  const result = await changeOwnPassword(session, form.get('current_password')?.toString() ?? '', next, await clientIp());
  if (!result.ok) return { ok: false, message: result.error };
  // Other devices are signed out; keep this one signed in with a fresh cookie.
  (await cookies()).set(SESSION_COOKIE, createSessionValue(result.account), sessionCookieOptions);
  return { ok: true, message: 'Password changed. Your other devices have been signed out.' };
}

export async function signOutOtherDevices(): Promise<void> {
  const session = await currentSession();
  if (!session) redirect('/login?next=/account');
  await signOutEverywhere(session, session.id, await clientIp());
  (await cookies()).delete(SESSION_COOKIE);
  redirect('/login');
}
