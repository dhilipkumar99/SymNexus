# SymNexus Team gateway, serving the Burst web app it builds from ../burst/ui.
# Build context: team/

FROM node:24-slim AS ui
WORKDIR /ui
COPY burst/ui/package.json burst/ui/package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY burst/ui/ ./
RUN npx vite build

FROM node:24-slim
ENV NODE_ENV=production
WORKDIR /app
COPY gateway/package.json gateway/package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund
COPY gateway/src ./src
COPY --from=ui /ui/dist ./public
USER node
EXPOSE 8080
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s \
  CMD ["node", "-e", "fetch('http://127.0.0.1:8080/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"]
CMD ["node", "src/server.mjs"]
