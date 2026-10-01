# SymNexus Team

Internal messaging for SymNexus employees: [Burst](https://github.com/barbacane-dev/burst)
(channels, threads, DMs, reactions, pins, files, search, live updates) behind the spark-admin-style
sign-in, running entirely on Vercel.

**Production:** https://symnexus-team.vercel.app (Vercel project `symnexus-team`).

```text
Browser ──> web (Next.js, public) ─┬─ /login, /setup/*      sign-in, set-password links
                                   ├─ /accounts, /account   account management, own account
                                   ├─ /*                    chat app (Burst SPA), signed-in only
                                   ├─ /api/*, /ws           session checked -> Burst with verified identity
                                   └─ /storage/*            file storage for Burst -> Vercel Blob (private)
                         burst (container, no public route) ──> Neon Postgres
```

| Path | What it is |
| --- | --- |
| `web/` | Next.js app built from spark-admin's sign-in: login page, server action, signed httpOnly cookie, server-side guard; plus account management and the proxy to Burst. |
| `burst/` | Burst, vendored from upstream commit `c0924d8` (Apache-2.0). See [Changes to Burst](#changes-to-burst). |
| `vercel.json` | One Vercel project, two services: `web` (public) and `burst` (private, reachable only through `web`'s binding). |
| `Dockerfile`, `burst-start.sh` | Burst's container image and start-up settings. |
| `docker-compose.yml` | Local development only: Postgres + Burst. |

## Roles

Modelled on Slack's Primary Owner / Admin / Member:

| | Master admin | Admin | Member |
| --- | :---: | :---: | :---: |
| Use messaging; change own password; sign out everywhere | ✓ | ✓ | ✓ |
| Burst admin panel: channels, message export, audit log, custom emoji, webhooks, bots | ✓ | ✓ | |
| Invite members; deactivate, reactivate, reset or remove members | ✓ | ✓ | |
| Invite admins; promote members to admin and back; manage admins | ✓ | | |
| Can be deactivated, removed or demoted by anyone | never | by the master admin | by admins |

There is exactly one master admin. Account changes are recorded in the activity log on `/accounts`;
workspace activity is in Burst's audit log in the admin panel.

## Sign-in and sessions

- Email + password, as in spark-admin. Passwords are scrypt hashes; at least 12 characters.
- New people get a **single-use invite link** (7 days) to set their own password; a reset produces a
  single-use link (24 hours) and signs the person out everywhere. Admins copy the link from
  `/accounts` and send it privately.
- The session cookie is httpOnly, `SameSite=Lax`, signed with `SESSION_SECRET` (HMAC-SHA256), and
  lasts 7 days. It carries the account's session version: deactivation, a reset, a password change or
  "sign out everywhere" ends every older session within seconds.
- Failed sign-ins return the same answer whether or not the email exists, and are throttled per email
  and per address (8 failures in 15 minutes), shared across instances in Postgres.
- Only `@symnexus.co` addresses can be invited (`ALLOWED_EMAIL_DOMAINS`). The master admin, created
  from the command line, is the one exception.
- `/api` and `/ws`: the account is re-checked on every request; identity headers sent by the browser
  are dropped and replaced with the verified ones; writes and WebSockets must be same-origin.

## Master admin

Created once from the command line (prints a one-time set-password link):

```bash
cd team && vercel env pull .env.local --yes          # DATABASE_URL for the production database
cd web && set -a && . ../.env.local && set +a
TEAM_PUBLIC_URL=https://symnexus-team.vercel.app npm run owner -- create <email> "<Full Name>"
```

Locked out? `npm run owner -- recover` issues a new link (24 hours) and ends the master admin's
sessions. Everything else is done in the app at `/accounts`.

## Deploying

The project deploys from this folder with the Vercel CLI (it is not connected to Git, so pushes to the
main site never rebuild it):

```bash
cd team && vercel deploy --prod
```

Configured in the Vercel project:

| Variable | Source |
| --- | --- |
| `DATABASE_URL`, `DATABASE_URL_UNPOOLED` | Neon integration (`symnexus-team-db`) |
| `BLOB_READ_WRITE_TOKEN` | Private Blob store `symnexus-team-files` |
| `SESSION_SECRET` | random, 64 hex characters. Rotating it signs everyone out. |
| `BURST_STORAGE_GATEWAY_API_KEY` | random, shared by the two services for `/storage` |
| `BURST_STORAGE_GATEWAY_URL` | `https://symnexus-team.vercel.app` (Vercel does not allow the two services to bind to each other, so Burst reaches `/storage` at the public address; it is protected by the key) |

Platform notes:

- Burst is a container that scales to zero; real-time events reach every instance through Postgres
  (`pg_notify`). Each deploy compiles it from source (several minutes).
- WebSockets close at the function time limit and the chat app reconnects on its own.
- Uploads pass through the `web` service, so files are limited to 4 MB (Vercel's request limit).
- Optional hardening in the dashboard: a Firewall rate-limit rule on `POST /login`, a custom domain
  such as `team.symnexus.co`, and Pro-plan settings (longer WebSocket sessions).

## Local development

```bash
cd team && docker compose up -d --build        # Postgres on 127.0.0.1:5434, Burst on 127.0.0.1:3000
cd web && npm ci
export DATABASE_URL=postgres://team:team-dev-only@127.0.0.1:5434/team SESSION_SECRET=$(openssl rand -hex 32)
TEAM_PUBLIC_URL=http://127.0.0.1:3100 npm run owner -- create you@example.com "You"
npm run build && BURST_INTERNAL_URL=http://127.0.0.1:3000 npx next start -H 127.0.0.1 -p 3100
```

Open the printed link. Live updates (`/ws`) need the Vercel runtime, so locally new messages appear on
reload.

## Tests

```bash
cd team/web && npm test                      # unit tests (cookie, headers, WebSocket bridge)
docker compose -f ../docker-compose.yml up -d postgres && \
  docker compose -f ../docker-compose.yml exec -T postgres psql -U team -c 'CREATE DATABASE team_test'
TEST_DATABASE_URL=postgres://team:team-dev-only@127.0.0.1:5434/team_test npm test   # + permissions, links, throttle, revocation
cd team/burst/ui && npm ci && npx vitest run  # Burst web app
```

## Changes to Burst

All in `burst/ui`, kept small so upstream updates stay easy:

- `index.html`, `src/components/layout/main-layout.tsx`, `src/components/layout/sidebar.tsx`:
  SymNexus favicon and wordmark (served from `web/public/brand/`), `noindex`, sidebar links to "My
  account" and (admins) "Manage accounts", and the account/settings icons in their own row above the
  signed-in user.
- `src/components/layout/sidebar-resize.tsx`, `use-sidebar-width.ts` (new): drag the sidebar's right
  edge to resize it (200–480 px, at most half the window; arrow keys when focused; double-click resets;
  remembered per browser).
- `src/lib/auth/context.tsx`: the session comes from the cookie (restored on every load); signing out
  clears it on the server and returns to `/login`.
- `src/pages/login.tsx`: hands over to the server sign-in page.

To update Burst: replace `burst/` with a newer upstream checkout, re-apply the changes above, run both
test suites, and redeploy.
