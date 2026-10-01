# SymNexus Team

Internal messaging for SymNexus employees: [Burst](https://github.com/barbacane-dev/burst)
(channels, threads, DMs, reactions, files, search) behind our own email sign-in gateway.

```text
Browser ──HTTPS──> TLS proxy ──> gateway (:8080) ─┬─ /oauth/burst/token, /account   sign-in, change password
                                                  ├─ /api/*, /ws   authenticated proxy ──> burst (:3000) ──> PostgreSQL
                                                  └─ /*            web app (built from burst/ui)
```

| Path | What it is |
| --- | --- |
| `burst/` | Burst, vendored from upstream commit `c0924d8` (Apache-2.0). See [Changes to Burst](#changes-to-burst). |
| `gateway/` | The sign-in gateway (Node.js, one dependency: `pg`). |
| `docker-compose.yml` | PostgreSQL + Burst + gateway on a private network. |

## How sign-in works

- Employees sign in with their **email and password**. Passwords are hashed with scrypt
  (N=2^15, r=8, p=1, per-password salt); at least 12 characters.
- A successful sign-in returns a random 256-bit session token. Only its SHA-256 is stored, in the
  `gateway.sessions` table. Sessions end after 12 hours without use or 7 days in total
  (`SESSION_IDLE_SECONDS`, `SESSION_MAX_SECONDS`), on sign-out, on a password change, or when the
  account is deactivated.
- Failed sign-ins return the same message and take the same time whether or not the email has an
  account. Sign-in is limited to 20 attempts per IP and 8 failures per email per 15 minutes.
- For every `/api` request and the `/ws` WebSocket, the gateway checks the token, removes any
  `X-Auth-*` headers, `Authorization` and `access_token` sent by the browser, and sets
  `X-Auth-Consumer` (the account's permanent id), `X-Auth-Consumer-Groups` (`admin` or `member`) and
  `X-Auth-Claims` (name, email). Burst trusts those headers from the gateway's fixed address only
  (`BURST_AUTH_TRUSTED_PROXIES`), and Burst's port is never published.
- Accounts can only be created for `ALLOWED_EMAIL_DOMAINS` (default `symnexus.co`). There is no
  self-registration.

## Run it

```bash
cd team
cp .env.example .env             # set POSTGRES_PASSWORD to a long random value
docker compose up -d --build     # first build compiles Burst (several minutes)
docker compose exec gateway node src/cli.mjs add you@symnexus.co "Your Name" --admin
```

Open http://127.0.0.1:8080 and sign in with the temporary password the last command printed.
Change it at `/account`.

## Managing accounts

Run these with `docker compose exec gateway node src/cli.mjs …`:

| Command | Effect |
| --- | --- |
| `add <email> <name> [--admin]` | Create an account; prints a one-time temporary password. |
| `reset-password <email>` | New temporary password; signs the person out everywhere. |
| `role <email> admin\|member` | Admins also get Burst's admin panel. |
| `deactivate <email>` / `activate <email>` | Block or restore sign-in; deactivating signs out every session. |
| `sign-out <email>` | End every session for that person. |
| `list` | Accounts, roles, active sessions, last sign-in. |

Add `--password-stdin` to `add` or `reset-password` to set a chosen password instead
(`printf '%s' "$PW" | docker compose exec -T gateway node src/cli.mjs add …`).
Send temporary passwords over a private channel, never in the team chat itself.

## Production

1. Run the stack on a server with Docker (2 GB RAM is plenty for a small team) and point
   `team.symnexus.co` at it.
2. Put a TLS proxy in front of the gateway. Caddy is the simplest:
   `team.symnexus.co { reverse_proxy 127.0.0.1:8080 }` (Caddy obtains the certificate).
3. In `.env` set `TRUST_PROXY=true` (so rate limits see real client addresses) and, once HTTPS
   works, `HSTS=true`.
4. Back up the `pgdata` volume (messages, accounts) and the `uploads` volume (files).

## Tests

```bash
cd team/gateway && npm ci && npm test       # gateway unit + end-to-end tests
cd team/burst/ui && npm ci && npx vitest run # Burst web app tests
```

## Changes to Burst

Kept small so upstream updates stay easy to merge. All are in `burst/ui`:

- `index.html`, `src/pages/login.tsx`, `src/components/layout/main-layout.tsx`, `src/components/layout/sidebar.tsx`: "SymNexus Team"
  branding, an Email field instead of Username, a "Change password" link, `noindex`.
- `src/lib/auth/context.tsx`: shows the gateway's sign-in error, and signing out also revokes the
  session on the gateway.

To update Burst: replace `burst/` with a newer upstream checkout, re-apply the changes above,
run both test suites, and rebuild.
