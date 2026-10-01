#!/bin/sh
# Starts Burst with settings derived from the environment it runs in.
#
# On Vercel (team/vercel.json) Burst is a private container service: it has no
# public route, the web service is the only caller (through its binding), and
# files go to Vercel Blob through the web service's /storage endpoint.
set -eu

# Database: the Neon integration provides DATABASE_URL; LISTEN/NOTIFY (used to
# fan out real-time events across instances) needs the unpooled connection.
export BURST_DATABASE_URL="${BURST_DATABASE_URL:-${DATABASE_URL_UNPOOLED:-${DATABASE_URL:-}}}"
if [ -z "$BURST_DATABASE_URL" ]; then
  echo "burst-start: set DATABASE_URL (or BURST_DATABASE_URL)" >&2
  exit 1
fi

# Vercel routes traffic to $PORT (80 by default).
export BURST_SERVER_LISTEN="${BURST_SERVER_LISTEN:-0.0.0.0:${PORT:-80}}"
export BURST_SERVER_ADMIN_LISTEN="${BURST_SERVER_ADMIN_LISTEN:-127.0.0.1:3001}"

# Several instances may run at once: share events through PostgreSQL.
export BURST_BROKER_BACKEND="${BURST_BROKER_BACKEND:-pg_notify}"

# Only the web service can reach this one, so any peer it sees is that service.
# Override with specific addresses when running Burst somewhere it is exposed.
export BURST_AUTH_TRUSTED_PROXIES="${BURST_AUTH_TRUSTED_PROXIES:-0.0.0.0/0,::/0}"

# Files: Vercel Blob via the web service when its URL is bound in, otherwise the
# local disk (local development).
if [ -n "${BURST_STORAGE_GATEWAY_URL:-}" ]; then
  export BURST_STORAGE_BACKEND=gateway
  # Function request bodies are capped at 4.5 MB on Vercel.
  export BURST_STORAGE_MAX_FILE_SIZE="${BURST_STORAGE_MAX_FILE_SIZE:-4194304}"
else
  export BURST_STORAGE_BACKEND="${BURST_STORAGE_BACKEND:-local}"
fi

exec /usr/local/bin/burst "$@"
