// Calls from the web app to the private Burst service.
//
// Burst reads the caller's identity from X-Auth-* headers and believes them
// only from trusted peers. On Vercel, Burst has no public route: it is reachable
// only through the service binding this app holds (BURST_INTERNAL_URL), so this
// app is the only thing that can set those headers.

import type { Session } from './auth.ts';

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
    // The permanent account id: Burst keys its user record on it, so a changed
    // email or name never splits someone's history.
    'x-auth-consumer': `sx:${session.id}`,
    // The master admin and admins get Burst's admin panel (channels, exports,
    // audit log, emoji, webhooks, bots).
    'x-auth-consumer-groups': session.role === 'member' ? 'member' : 'admin',
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

// Mirrors a deactivation into Burst, so the person shows as deactivated in the
// workspace. Acts with the identity of the admin making the change. Best effort:
// sign-in is already blocked by the account change itself.
export async function setBurstUserDeactivated(actor: Session, email: string, deactivated: boolean): Promise<void> {
  try {
    const headers = { ...identityHeaders(actor), 'content-type': 'application/json' };
    let cursor: string | undefined;
    for (let page = 0; page < 50; page++) {
      const url = burstUrl('/api/admin/users', `?limit=100${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`);
      const res = await fetch(url, { headers, signal: AbortSignal.timeout(10_000) });
      if (!res.ok) throw new Error(`list users: ${res.status}`);
      const body = (await res.json()) as { items: { id: string; email?: string | null }[]; cursor?: string };
      const user = body.items.find((u) => u.email?.toLowerCase() === email);
      if (user) {
        const patch = await fetch(burstUrl(`/api/admin/users/${encodeURIComponent(user.id)}`), {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ deactivated }),
          signal: AbortSignal.timeout(10_000),
        });
        if (!patch.ok) throw new Error(`update user: ${patch.status}`);
        return;
      }
      if (!body.cursor) return; // never signed in, so Burst has no user for them
      cursor = body.cursor;
    }
  } catch (err) {
    console.error(`[team] could not ${deactivated ? 'deactivate' : 'reactivate'} ${email} in Burst:`, err);
  }
}
