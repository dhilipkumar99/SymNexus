// /api/*: the Burst REST API, reached only through this handler. The session
// cookie is verified on every request and turned into Burst identity headers;
// whatever identity headers the browser sent are dropped.

import { cookies } from 'next/headers';
import { readSession, SESSION_COOKIE } from '@/lib/auth';
import { burstUrl, forwardHeaders, isSameOrigin } from '@/lib/burst';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Incoming webhooks authenticate with their own secret, inside Burst.
const WEBHOOK_TRIGGER = /^\/api\/webhooks\/[^/]+\/trigger$/;

function problem(status: number, title: string, detail?: string) {
  return Response.json(
    { type: 'about:blank', title, status, ...(detail ? { detail } : {}) },
    { status, headers: { 'content-type': 'application/problem+json', 'cache-control': 'no-store' } },
  );
}

async function handle(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const isWebhook = request.method === 'POST' && WEBHOOK_TRIGGER.test(url.pathname);

  let session = null;
  if (!isWebhook) {
    session = readSession((await cookies()).get(SESSION_COOKIE)?.value);
    if (!session) return problem(401, 'Unauthorized', 'Sign in again to continue.');
    if (!['GET', 'HEAD'].includes(request.method) && !isSameOrigin(request)) return problem(403, 'Forbidden');
  }

  url.searchParams.delete('access_token');
  const hasBody = !['GET', 'HEAD'].includes(request.method);
  let upstream: Response;
  try {
    upstream = await fetch(burstUrl(url.pathname, url.search), {
      method: request.method,
      headers: forwardHeaders(request.headers, session),
      body: hasBody ? request.body : undefined,
      // @ts-expect-error -- Node's fetch needs duplex for a streamed request body
      duplex: hasBody ? 'half' : undefined,
      redirect: 'manual',
      signal: AbortSignal.timeout(55_000),
    });
  } catch {
    return problem(502, 'Bad Gateway', 'The messaging service is not responding. Try again shortly.');
  }

  const headers = new Headers(upstream.headers);
  for (const h of ['connection', 'keep-alive', 'transfer-encoding', 'content-encoding', 'content-length']) headers.delete(h);
  headers.set('cache-control', headers.get('cache-control') ?? 'no-store');
  return new Response(upstream.body, { status: upstream.status, statusText: upstream.statusText, headers });
}

export const GET = handle;
export const HEAD = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
