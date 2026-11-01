# SymNexus Team

Internal messaging for SymNexus employees: [Burst](https://github.com/barbacane-dev/burst)
(channels, threads, DMs, reactions, pins, files, search, live updates) behind the spark-admin-style
sign-in, running entirely on Vercel. Everyone also gets a [CRM, task board and wiki](#crm-tasks-and-wiki),
and admins get [email campaigns](#email-campaigns) sent from info@symnexus.co. Everything runs on the
free tiers already in use (Vercel Hobby, Neon); nothing here adds a paid service.

**Production:** https://app.symnexus.co (Vercel project `symnexus-team`; also https://symnexus-team.vercel.app).

```text
Browser ──> web (Next.js, public) ─┬─ /login, /setup/*      sign-in, set-password links
                                   ├─ /accounts, /account   account management, own account
                                   ├─ /crm, /tasks, /wiki   CRM, task board, wiki (everyone signed in)
                                   ├─ /api/leads            symnexus.co form submissions -> CRM (shared secret)
                                   ├─ /campaigns/*          email campaigns (admins) ──> Microsoft Graph (info@)
                                   ├─ /unsubscribe/*        public unsubscribe links in campaign emails
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
TEAM_PUBLIC_URL=https://app.symnexus.co npm run owner -- create <email> "<Full Name>"
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
| `MICROSOFT_TENANT_ID`, `MICROSOFT_CLIENT_ID`, `MICROSOFT_CLIENT_SECRET` | Entra ID app for campaign email (see [Email campaigns](#email-campaigns)) |
| `CAMPAIGN_MAILBOX` | optional; the sending mailbox, `info@symnexus.co` by default |
| `CRON_SECRET` | random, at least 16 characters; protects `/campaigns/tick` (the Vercel cron sends it) |
| `TEAM_PUBLIC_URL` | `https://app.symnexus.co`: used in unsubscribe, invitation and reset links |
| `LEADS_API_SECRET` | random, at least 16 characters; the same value is set on the website project so its forms can post to `/api/leads` |
| `BURST_STORAGE_GATEWAY_URL` | `https://symnexus-team.vercel.app` (Vercel does not allow the two services to bind to each other, so Burst reaches `/storage` at the public address; it is protected by the key) |

Platform notes:

- Burst is a container that scales to zero; real-time events reach every instance through Postgres
  (`pg_notify`). Each deploy compiles it from source (several minutes).
- WebSockets close at the function time limit and the chat app reconnects on its own.
- Uploads pass through the `web` service, so files are limited to 4 MB (Vercel's request limit).
- Optional hardening in the dashboard: a Firewall rate-limit rule on `POST /login`, and Pro-plan
  settings (longer WebSocket sessions).

### Custom domain: app.symnexus.co

```bash
cd team && vercel domains add app.symnexus.co    # adds it to symnexus-team; prints the DNS record
```

In GoDaddy DNS for symnexus.co add a **CNAME**: name `app`, value as printed by Vercel (normally
`cname.vercel-dns.com`). Once `https://app.symnexus.co/login` loads, set `TEAM_PUBLIC_URL` to it and
deploy the website, whose "Team login" link points there (`TEAM_LOGIN_URL` in `src/data/nav.php`).

## CRM, tasks and wiki

Built into the app (`web/lib/work`, pages under `web/app/crm`, `tasks`, `wiki`), in the `team_work`
schema, created on first use. Every signed-in employee can use them; deleting contacts and wiki pages
is for admins and is written to the audit log (`crm.contact_deleted`, `wiki.page_deleted`).

- **CRM** (`/crm`): contacts with organization, title, owner, deal value and a dated next step, in a
  pipeline (Lead → Contacted → Qualified → Proposal → Won / Lost) shown as a board or a filterable
  list. Each contact has a history of notes, calls, emails, meetings, website submissions and stage
  changes, plus its tasks. **Export CSV** produces a list the Campaigns tool imports as-is.
- **Website leads**: symnexus.co's contact and demo forms post to `/api/leads` with
  `Authorization: Bearer $LEADS_API_SECRET`. A new address becomes a Lead; a known one gets the
  submission as a note (and a Lost contact reopens as a Lead). The website still emails info@ too, and
  tells the visitor it worked if either delivery succeeded.
- **Tasks** (`/tasks`): To do / Doing / Done, with an assignee, due date and optional CRM contact.
  Finished tasks leave the board after 14 days.
- **Wiki** (`/wiki`): Markdown pages anyone can edit, with a live preview. An empty wiki is seeded with
  *How we work*, *Onboarding checklist*, *Product one-pagers*, *Sales playbook*, *Brand kit* and the
  *Setup checklist* (`web/lib/work/wiki-seed.ts`); after that they are ordinary pages. The renderer
  (`web/lib/work/markdown.ts`) escapes everything, so pages cannot carry markup or scripts.

## Email campaigns

Admins and the master admin send personalised email campaigns, with follow-ups, from
info@symnexus.co at `/campaigns` (also the envelope icon in the chat sidebar). The feature set follows
[PaulleDemon/Email-automation](https://github.com/PaulleDemon/Email-automation), reimplemented here:
that project is AGPL-3.0 with a clause forbidding commercial use without a paid licence, so none of
its code is used.

- **Templates** (`/campaigns/templates`): plain text with Jinja-style variables and conditions
  (`{{ first_name | default("there") }}`, `{% if company %}…{% endif %}`), checked and previewed as
  you type. Code: `web/lib/mail/template.ts`.
- **Campaigns**: a CSV list (each column becomes a variable; bad and duplicate addresses are dropped),
  a first email, and up to 5 follow-ups. Each follow-up waits N days after that person's previous
  email and goes to everyone, only people who have not replied, or only people who replied, by
  default as a reply in the same thread. Campaigns start as drafts: check the warnings, send yourself
  a test, then launch now or at a set time. Pause, resume and stop at any time.
- **Replies** are found by reading the mailbox: mail from the person's address, or in the thread of
  an email they were sent. Auto-replies and bounces don't count. You can also mark someone as replied
  by hand.
- **Unsubscribe**: every email ends with the signature, the footer (put the postal address there, as
  CAN-SPAM requires) and an unsubscribe link. Unsubscribed people, and anyone added under Settings →
  Do not email, never get campaign email again.
- **Sending** (`web/lib/mail/dispatch.ts`): about 24 emails a minute (Microsoft 365 allows 30 per
  mailbox), up to the daily limit in Settings (300 by default). Each email is sent at most once. If
  Microsoft refuses access, every campaign pauses with the reason. After 10 failures in a row, that
  campaign pauses. No open-tracking pixels or rewritten links are used.

**When sending happens.** The Hobby plan allows one cron run a day, so `vercel.json` runs
`/campaigns/tick` daily at 13:00 UTC. Sending also starts at once after a launch or resume, and
whenever someone has a campaign page open. A run that has more to send hands over to the next run
itself. As a result, "Send now" campaigns go out straight away, while scheduled starts and follow-ups
go out by the next daily run or page visit. On the Pro plan, set the cron to `*/5 * * * *` for
five-minute accuracy.

### Connecting info@symnexus.co (one-time setup)

Microsoft 365 no longer accepts passwords over SMTP, so campaigns send through Microsoft Graph as an
app. A Microsoft 365 / Entra administrator does this once. The tenant is GoDaddy-managed
(`NETORGFT21073943`), so admin rights may have to come through GoDaddy.

1. In [Entra admin center](https://entra.microsoft.com) → App registrations → New registration
   "SymNexus Team campaigns" (single tenant). Note the **Directory (tenant) ID** and **Application
   (client) ID**.
2. API permissions → Microsoft Graph → **Application** permissions → `Mail.Send` and
   `Mail.ReadWrite` → **Grant admin consent**. (ReadWrite is needed to create emails as drafts, which
   is how follow-ups reply in the same thread, and to read replies.)
3. Certificates & secrets → New client secret (24 months). Copy the **value**, and put a reminder in
   the calendar to renew it: when it expires, campaigns pause with a sign-in error.
4. **Limit the app to info@ only.** Without this step, the permissions above cover every mailbox in
   the tenant. In Exchange Online PowerShell (RBAC for Applications):
   ```powershell
   Connect-ExchangeOnline
   New-ServicePrincipal -AppId <client-id> -ObjectId <enterprise-app-object-id> -DisplayName "SymNexus Team campaigns"
   New-ManagementScope -Name "Campaign mailbox" -RecipientRestrictionFilter "PrimarySmtpAddress -eq 'info@symnexus.co'"
   New-ManagementRoleAssignment -App <client-id> -Role "Application Mail.Send" -CustomResourceScope "Campaign mailbox"
   New-ManagementRoleAssignment -App <client-id> -Role "Application Mail.ReadWrite" -CustomResourceScope "Campaign mailbox"
   ```
   Then remove the two tenant-wide Graph permissions from step 2 (the scoped Exchange roles replace
   them), and check with `Test-ServicePrincipalAuthorization -Identity <client-id> -Resource info@symnexus.co`.
5. In Vercel:
   ```bash
   cd team
   vercel env add MICROSOFT_TENANT_ID production
   vercel env add MICROSOFT_CLIENT_ID production
   vercel env add MICROSOFT_CLIENT_SECRET production --sensitive
   openssl rand -hex 32 | vercel env add CRON_SECRET production --sensitive
   echo https://symnexus-team.vercel.app | vercel env add TEAM_PUBLIC_URL production
   vercel deploy --prod
   ```
6. In the app, go to Campaigns → Settings → Check connection, with a Gmail address as the test
   recipient. In Gmail, "Show original" should show **SPF, DKIM and DMARC: PASS**.

**Deliverability: check DNS first.** As of October 2026, symnexus.co's SPF record
(`v=spf1 include:secureserver.net -all`) does not list Microsoft 365, and no Microsoft 365 DKIM keys
(`selector1/2._domainkey`) are published. DMARC is `p=quarantine`, so mail from info@ through
Microsoft 365 is likely to land in spam. In DNS, add `include:spf.protection.outlook.com` to the SPF
record, then enable DKIM for symnexus.co in Microsoft Defender (Email authentication settings) and
publish the two CNAMEs it shows. Send a test through step 6 before any real campaign.

**Volume.** Microsoft's terms allow sending to people you have a business reason to contact, not bulk
marketing. Start with a low daily limit (50–100 a day for the first weeks) and raise it gradually.
Volumes in the thousands belong on a dedicated sending service; the Resend account already verified
for symnexus.co is one.

## Local development

```bash
cd team && docker compose up -d --build        # Postgres on 127.0.0.1:5434, Burst on 127.0.0.1:3000
cd web && npm ci
export DATABASE_URL=postgres://team:team-dev-only@127.0.0.1:5434/team SESSION_SECRET=$(openssl rand -hex 32)
TEAM_PUBLIC_URL=http://127.0.0.1:3100 npm run owner -- create you@example.com "You"
npm run build && BURST_INTERNAL_URL=http://127.0.0.1:3000 npx next start -H 127.0.0.1 -p 3100
```

Open the printed link. Use `http://localhost:3100` rather than `127.0.0.1`: in production mode the
session cookie is `Secure`, and Chrome keeps that over plain http only for `localhost`. Live updates (`/ws`) need the Vercel runtime, so locally new messages appear on
reload.

## Tests

```bash
cd team/web && npm test                      # unit tests (cookie, headers, WebSocket bridge)
docker compose -f ../docker-compose.yml up -d postgres && \
  docker compose -f ../docker-compose.yml exec -T postgres psql -U team -c 'CREATE DATABASE team_test'
TEST_DATABASE_URL=postgres://team:team-dev-only@127.0.0.1:5434/team_test npm test   # + permissions, links, throttle, revocation, campaigns, CRM, tasks, wiki
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
- `src/components/layout/sidebar.tsx` also has the CRM, Tasks and Wiki links, and "Email campaigns" (admins).
- `src/lib/auth/context.tsx`: the session comes from the cookie (restored on every load); signing out
  clears it on the server and returns to `/login`.
- `src/pages/login.tsx`: hands over to the server sign-in page.

To update Burst: replace `burst/` with a newer upstream checkout, re-apply the changes above, run both
test suites, and redeploy.
