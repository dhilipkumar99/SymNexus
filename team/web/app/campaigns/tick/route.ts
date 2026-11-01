// /campaigns/tick: starts a campaign dispatcher run. Called by the Vercel cron
// (GET) and by a run that stopped with emails still due (POST). Both carry
// `Authorization: Bearer $CRON_SECRET`. The run happens after the response.

import { cronAuthorised, dispatchSoon } from '@/lib/mail/run';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

function tick(request: Request): Response {
  if (!cronAuthorised(request)) return new Response(null, { status: 401 });
  dispatchSoon(new URL(request.url).origin);
  return new Response(null, { status: 202, headers: { 'cache-control': 'no-store' } });
}

export const GET = tick;
export const POST = tick;
