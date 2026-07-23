#!/usr/bin/env bash
#
# Build and (re)start the Sugar & Leather site container from the current checkout.
#
# This is the single source of truth for how production is (re)deployed on the VM.
# It assumes the working tree is already at the commit you want live:
#   - The GitHub Actions workflow (.github/workflows/deploy.yml) syncs the repo to
#     origin/main before invoking this script.
#   - To deploy by hand, `git pull` first, then run: bash deploy/deploy.sh
#
# Override the defaults below with environment variables if your VM differs, e.g.:
#   HOST_PORT=8080 bash deploy/deploy.sh
#
set -euo pipefail

IMAGE_NAME="${IMAGE_NAME:-sugar-and-leather}"
CONTAINER_NAME="${CONTAINER_NAME:-sugar-and-leather}"
HOST_PORT="${HOST_PORT:-80}"     # host port the fronting proxy / public traffic hits
CONTAINER_PORT=80                # Caddy inside the container listens on :80 (see Caddyfile.container)

# Move to the repository root (this script lives in <repo>/deploy).
cd "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "==> Deploying commit $(git rev-parse --short HEAD) ($(git log -1 --pretty=%s))"

# Prefer docker compose if the VM defines a compose stack; otherwise use plain docker.
if [ -f docker-compose.yml ] || [ -f compose.yml ] || [ -f docker-compose.yaml ] || [ -f compose.yaml ]; then
  echo "==> Compose file detected — deploying with docker compose"
  docker compose up -d --build --remove-orphans
else
  echo "==> Building image ${IMAGE_NAME}:latest"
  docker build -t "${IMAGE_NAME}:latest" .

  echo "==> Replacing container ${CONTAINER_NAME} (host ${HOST_PORT} -> container ${CONTAINER_PORT})"
  docker rm -f "${CONTAINER_NAME}" 2>/dev/null || true
  docker run -d \
    --name "${CONTAINER_NAME}" \
    --restart unless-stopped \
    -p "${HOST_PORT}:${CONTAINER_PORT}" \
    "${IMAGE_NAME}:latest"

  echo "==> Pruning dangling images"
  docker image prune -f >/dev/null 2>&1 || true
fi

echo "==> Deploy complete"
