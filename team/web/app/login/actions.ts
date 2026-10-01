'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createSessionValue, SESSION_COOKIE, sessionCookieOptions, signIn } from '@/lib/auth';
import { clientIp } from '@/lib/request';

// Only same-site paths are honoured, so the sign-in page cannot be used to
// bounce someone to another site.
function safeNext(value: FormDataEntryValue | null): string {
  const next = value?.toString() ?? '/';
  return next.startsWith('/') && !next.startsWith('//') && !next.startsWith('/login') ? next : '/';
}

export async function login(_prev: { error: string; email?: string }, formData: FormData) {
  const email = formData.get('email')?.toString() ?? '';
  const password = formData.get('password')?.toString() ?? '';

  const result = await signIn(email, password, await clientIp());
  // Hand the email back: React resets the form after a server action.
  if (!result.ok) return { error: result.error, email };

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, createSessionValue(result.account), sessionCookieOptions);
  redirect(safeNext(formData.get('next')));
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect('/login');
}
