// GET /ws: the chat's real-time connection. Verifies the session cookie, then
// relays the WebSocket to Burst with the signed-in employee's identity.
//
// Vercel closes WebSockets when the function reaches its max duration; the
// Burst web app reconnects with backoff, so that is invisible to users.

import { experimental_upgradeWebSocket } from '@vercel/functions';
import { cookies } from 'next/headers';
import { readSession, SESSION_COOKIE } from '@/lib/auth';
import { burstUrl, identityHeaders, isSameOrigin } from '@/lib/burst';
import { bridge } from '@/lib/ws-bridge';

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (request.headers.get('upgrade')?.toLowerCase() !== 'websocket') {
    return new Response('Expected a WebSocket upgrade', { status: 426 });
  }
  // Cross-site WebSocket hijacking guard: browsers always send Origin here.
  if (!isSameOrigin(request)) return new Response('Forbidden', { status: 403 });

  const session = readSession((await cookies()).get(SESSION_COOKIE)?.value);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const target = burstUrl('/ws');
  target.protocol = target.protocol === 'https:' ? 'wss:' : 'ws:';

  return experimental_upgradeWebSocket((client) => {
    bridge(client, target, identityHeaders(session));
  });
}
