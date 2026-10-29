# syntax=docker/dockerfile:1

# Build tools are needed if native bcrypt / better-sqlite3 binaries must be compiled.
FROM node:24-bookworm-slim AS build-base
WORKDIR /app
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

# Build the React application with development dependencies.
FROM build-base AS client-build
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY . .
RUN npm run build

# Install only the server's runtime dependencies.
FROM build-base AS server-deps
WORKDIR /app/server
COPY server/package.json server/package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev

# The final image contains the server and compiled client, without build tools.
FROM node:24-bookworm-slim AS runtime
WORKDIR /app/server
ENV NODE_ENV=production \
    PORT=8080 \
    STATIC_DIR=/app/public \
    DB_PATH=/app/data/emissium.db

COPY --from=server-deps --chown=node:node /app/server/node_modules ./node_modules
COPY --chown=node:node server/ ./
COPY --from=client-build --chown=node:node /app/dist /app/public
RUN mkdir -p /app/data && chown node:node /app/data

USER node
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:' + process.env.PORT + '/api/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"
CMD ["node", "index.js"]
