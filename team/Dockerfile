# Burst API server, built from the vendored source in ./burst.
# Used by Vercel (the "burst" container service in vercel.json) and by
# docker-compose.yml for local development. Build context: team/

FROM rust:1-bookworm AS build
WORKDIR /src
COPY burst/Cargo.toml burst/Cargo.lock ./
COPY burst/crates ./crates
COPY burst/migrations ./migrations
RUN cargo build --release --locked -p burst && \
    cp target/release/burst /usr/local/bin/burst

FROM debian:bookworm-slim
RUN apt-get update && \
    apt-get install -y --no-install-recommends ca-certificates libcap2-bin && \
    rm -rf /var/lib/apt/lists/* && \
    useradd --system --uid 10001 --home-dir /data burst && \
    mkdir -p /data/uploads && chown -R burst /data
COPY --from=build /usr/local/bin/burst /usr/local/bin/burst
COPY burst-start.sh /usr/local/bin/burst-start
# Lets the unprivileged user listen on port 80, which Vercel routes to.
RUN chmod 0755 /usr/local/bin/burst-start && setcap 'cap_net_bind_service=+ep' /usr/local/bin/burst
USER burst
WORKDIR /data
ENV BURST_STORAGE_LOCAL_PATH=/data/uploads
EXPOSE 80
ENTRYPOINT ["/usr/local/bin/burst-start"]
