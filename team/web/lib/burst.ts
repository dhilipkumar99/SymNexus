// Calls from the web app to the private Burst service.
//
// Burst reads the caller's identity from X-Auth-* headers and believes them
// only from trusted peers. On Vercel, Burst has no public route: it is reachable
// only through the service binding this app holds (BURST_INTERNAL_URL), so this
// app is the only thing that can set those headers.

import type { Session } from './auth';

export function burstUrl(path: string, search = ''): URL {
  const base = process.env.BURST_INTERNAL_URL;
  if (!base) throw new Error('BURST_INTERNAL_URL is not set');
  const url = new URL(path, base);
  url.search = search;
  return url;
}

export function identityHeaders(session: Session): Record<string, string> {
  const local = session.email.split('@')[0].replace(/[^a-z0-9._-]/g, '').slice(0, 32) || 'user';
  return {
    // The email is the stable identity: Burst keys its user record on it.
    'x-auth-consumer': `sx:${session.email}`,
    'x-auth-consumer-groups': session.role,
    'x-auth-claims': JSON.stringify({ name: session.name, email: session.email, preferred_username: local }),
  };
}

const DROP = new Set([
  'host',
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
  'cookie',
  'authorization',
  'content-length',
  'x-forwarded-for',
  'x-forwarded-host',
  'x-forwarded-proto',
  'forwarded',
]);

// Request headers to forward: hop-by-hop headers, credentials, and anything a
// client sends that looks like an identity header are removed.
export function forwardHeaders(incoming: Headers, session: Session | null): Headers {
  const out = new Headers();
  incoming.forEach((value, name) => {
    const lower = name.toLowerCase();
    if (DROP.has(lower) || lower.startsWith('x-auth-') || lower.startsWith('x-vercel-')) return;
    out.set(lower, value);
  });
  if (session) for (const [k, v] of Object.entries(identityHeaders(session))) out.set(k, v);
  return out;
}

// Same-origin check for requests that change state. The session cookie is
// SameSite=Lax, so browsers already withhold it from cross-site POSTs; this is
// a second layer.
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true; // non-browser clients and same-origin navigations
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
