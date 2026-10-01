# SymNexus Team

Internal messaging for SymNexus employees: [Burst](https://github.com/barbacane-dev/burst)
(channels, threads, DMs, reactions, pins, files, search, live updates) behind the spark-admin-style
sign-in. Everything runs on Vercel: no server to manage.

```text
Browser ──> web (Next.js, public) ─┬─ /login            email + password  -> signed session cookie
                                   ├─ /*                chat app (Burst SPA), signed-in only (proxy.ts)
                                   ├─ /api/*, /ws       session checked -> Burst with verified identity
                                   └─ /storage/*        file storage for Burst -> Vercel Blob
                         burst (container, private) ──> Postgres (Neon)
```

| Path | What it is |
| --- | --- |
| `web/` | Next.js app built from spark-admin's sign-in: login page, server action, cookie session, guard, and the proxy to Burst. |
| `burst/` | Burst, vendored from upstream commit `c0924d8` (Apache-2.0). See [Changes to Burst](#changes-to-burst). |
| `vercel.json` | One Vercel project, two services: `web` (public) and `burst` (no public route). |
| `Dockerfile.burst`, `burst-start.sh` | Burst's container image and its start-up settings. |
| `docker-compose.yml` | Local development only: Postgres + Burst. |

## Sign-in (from spark-admin)

Same model as spark-admin: credentials are in an environment variable, an email + password form
posts to a server action, and the session is an httpOnly cookie checked on the server. Adapted for a
team:

- **One account per employee.** `TEAM_ACCOUNTS` is a JSON list of `{ email, name, role, password }`,
  where `password` is an scrypt hash (spark-admin had one admin with a plaintext password).
- **Signed session cookie.** The cookie holds the account and an expiry, signed with HMAC-SHA256
  (`SESSION_SECRET`). spark-admin's cookie was a fixed string anyone could set by hand; that is not
  accepted here.
- Sessions last 7 days (as in spark-admin). Removing an account or resetting its password signs that
  person out everywhere on the next request.
- Wrong email and wrong password give the same answer in the same time; repeated failures are
  throttled. For a limit shared by all instances, add a Vercel Firewall rate-limit rule on `POST /login`.
- Every `/api` and `/ws` request is checked again in its handler. Identity headers sent by the browser
  are dropped; the app sends Burst `X-Auth-Consumer` (the email), `X-Auth-Consumer-Groups`
  (`admin`/`member`) and `X-Auth-Claims` (name, email). Burst has no public route, so only this app
  can reach it. State-changing requests from other sites are refused.

## Managing accounts

From `team/web`:

```bash
npm run accounts -- add jane@symnexus.co "Jane Doe"          # prints a one-time temporary password
npm run accounts -- add you@symnexus.co "Your Name" --admin  # admins get Burst's admin panel
npm run accounts -- reset-password jane@symnexus.co
npm run accounts -- role jane@symnexus.co admin
npm run accounts -- remove jane@symnexus.co
npm run accounts -- list
npm run accounts -- push     # upload TEAM_ACCOUNTS to Vercel (production) and redeploy
```

The list is kept in `web/.team-accounts.json` (git-ignored, password hashes only). Changes go live
after `push`. Give temporary passwords to people privately, never in the chat itself. Only
`@symnexus.co` addresses can be added.

## Deploying on Vercel

One-time setup, from `team/`:

```bash
vercel link --project symnexus-team                    # creates the project
vercel integration add neon                            # Postgres (provides DATABASE_URL)
vercel blob store add symnexus-team-files              # private file storage
vercel env add SESSION_SECRET production               # value: openssl rand -hex 32
vercel env add BURST_STORAGE_GATEWAY_API_KEY production   # value: openssl rand -hex 32
cd web && npm run accounts -- add you@symnexus.co "Your Name" --admin && npm run accounts -- push
```

`push` deploys. After that, `vercel deploy --prod` (or `push`) redeploys. The site is served at the
project's `*.vercel.app` address; a custom domain such as `team.symnexus.co` can be attached later
in the Vercel dashboard.

Notes on the platform:

- Burst runs as a container that Vercel scales to zero and up as needed. Real-time events reach
  every instance through Postgres (`pg_notify`).
- WebSockets close when the function reaches its time limit; the chat app reconnects on its own.
- Uploads go through the `web` service, so files are limited to 4 MB (Vercel's request size limit).

## Local development

```bash
cd team && docker compose up -d --build        # Postgres + Burst on 127.0.0.1:3000
cd web && npm ci && npm run accounts -- add you@symnexus.co "You" --admin
SESSION_SECRET=$(openssl rand -hex 32) TEAM_ACCOUNTS="$(cat .team-accounts.json)" \
  BURST_INTERNAL_URL=http://127.0.0.1:3000 npm run build && \
SESSION_SECRET=… TEAM_ACCOUNTS="$(cat .team-accounts.json)" BURST_INTERNAL_URL=http://127.0.0.1:3000 \
  npx next start -H 127.0.0.1 -p 3100
```

Open http://127.0.0.1:3100. Live updates (`/ws`) need the Vercel runtime, so locally new messages
appear on reload; everything else works the same.

## Tests

```bash
cd team/web && npm test                     # sign-in, cookie, header scrubbing, WebSocket bridge
cd team/burst/ui && npm ci && npx vitest run # Burst web app
```

## Changes to Burst

All in `burst/ui`, kept small so upstream updates stay easy:

- `index.html`, `src/components/layout/main-layout.tsx`, `src/components/layout/sidebar.tsx`:
  "SymNexus Team" branding, `noindex`.
- `src/lib/auth/context.tsx`: the session comes from the cookie (restored on every load); signing out
  clears it on the server and returns to `/login`.
- `src/pages/login.tsx`: hands over to the server sign-in page.

To update Burst: replace `burst/` with a newer upstream checkout, re-apply the changes above, run both
test suites, and redeploy.
