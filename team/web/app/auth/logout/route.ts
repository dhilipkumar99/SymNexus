// POST /auth/logout: called by the chat app's sign-out button.

import { cookies } from 'next/headers';
import { SESSION_COOKIE } from '@/lib/auth';
import { isSameOrigin } from '@/lib/burst';

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return new Response(null, { status: 403 });
  (await cookies()).delete(SESSION_COOKIE);
  return new Response(null, { status: 204, headers: { 'cache-control': 'no-store' } });
}
