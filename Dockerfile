# syntax=docker/dockerfile:1

FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run verify

FROM caddy:2-alpine AS runner
COPY Caddyfile.container /etc/caddy/Caddyfile
COPY --from=build /app/dist /usr/share/caddy
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=5   CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
