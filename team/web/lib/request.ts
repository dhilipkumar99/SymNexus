// Per-request helpers for pages and server actions.

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { readSession, SESSION_COOKIE, type Session } from './auth.ts';

export async function currentSession(): Promise<Session | null> {
  return readSession((await cookies()).get(SESSION_COOKIE)?.value);
}

// For pages: the signed-in account, or a redirect to sign in.
export async function requireSession(next: string): Promise<Session> {
  const session = await currentSession();
  if (!session) redirect(`/login?next=${encodeURIComponent(next)}`);
  return session;
}

export async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get('x-real-ip') ?? h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
}

// This deployment's public origin, for invitation and reset links.
export async function publicOrigin(): Promise<string> {
  if (process.env.TEAM_PUBLIC_URL) return process.env.TEAM_PUBLIC_URL.replace(/\/$/, '');
  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost';
  const proto = h.get('x-forwarded-proto') ?? (host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https');
  return `${proto}://${host}`;
}
