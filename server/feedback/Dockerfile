# syntax=docker/dockerfile:1
FROM node:24-alpine

# No package.json and no npm install: the service has zero runtime dependencies on
# purpose (see the header comment in index.mjs). Nothing to lock, nothing to audit.
WORKDIR /app
COPY index.mjs ./

# Never run a public-facing write endpoint as root.
USER node

ENV NODE_ENV=production PORT=8080
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:8080/api/feedback/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "index.mjs"]
