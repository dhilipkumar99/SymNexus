// Guards the chat app. Every page request (anything that is not the sign-in
// page, an API handler or a static asset) needs a valid session: signed-in
// employees get the Burst web app, everyone else goes to /login.
//
// The account pages (/accounts, /account, /setup) and API handlers (/api, /ws,
// /storage, /auth) check the session themselves, as they must not rely on Proxy.

import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, verifySessionCookie } from '@/lib/auth';

export function proxy(request: NextRequest) {
  // Signature and expiry only: the shell holds no data, and every API call
  // re-checks the account in the database.
  if (!verifySessionCookie(request.cookies.get(SESSION_COOKIE)?.value)) {
    const login = new URL('/login', request.url);
    const next = request.nextUrl.pathname + request.nextUrl.search;
    if (next !== '/') login.searchParams.set('next', next);
    return NextResponse.redirect(login);
  }
  // The Burst SPA shell; it routes /channels/... and the rest client-side.
  const response = NextResponse.rewrite(new URL('/app.html', request.url));
  response.headers.set('cache-control', 'no-store');
  return response;
}

export const config = {
  matcher: [
    // Everything except: the sign-in page and its server action, API handlers,
    // Next internals and the SPA's static files.
    '/((?!login|accounts|account|setup/|api/|api$|ws$|storage/|auth/|_next/|assets/|env\\.js$|app\\.html$|favicon\\.ico$|robots\\.txt$).*)',
  ],
};
