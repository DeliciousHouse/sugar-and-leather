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
# PRODUCTION TOPOLOGY (see deploy/README.md):
#   The site container does NOT face the internet, and it is NOT standalone. It is one
#   service in the shared stack that lives in the PARENT directory of this repo
#   (~/openclaw-n8n-stack/docker-compose.yml, service + container_name `sugar-main-web`).
#   The stack's edge proxy container `n8n-caddy` owns host ports 80/443 for every
#   *.sugarandleather.com service and reverse-proxies the apex domain to us BY NAME
#   over the shared external docker network `docker-stack`:
#
#       internet :443 -> n8n-caddy -> reverse_proxy sugar-main-web:80 -> this container
#
#   Three rules follow, and violating any of them fails SILENTLY rather than loudly:
#     1. Deploy through the stack compose file when it defines this service. A bare
#        `docker run` creates a container outside compose's management; the next
#        stack-wide `docker compose up` then fights it, and compose-only settings
#        (memory limit, healthcheck) are silently dropped.
#     2. CONTAINER_NAME must match the edge Caddyfile upstream (`sugar-main-web`).
#        Deploy under any other name and you create a second, unreferenced container
#        while the old one keeps serving traffic — the site just never updates.
#     3. Never publish a host port. `n8n-caddy` already owns :80, so `-p 80:80` fails
#        with "port is already allocated" and leaves the container stuck in `created`.
#
#   All three of these bit us on 2026-07-23: the deploy built a correct image, then
#   failed to install it, and reported success. The site served a 2026-07-06 build for
#   three weeks. Hence the compose delegation, the rollback snapshot, and the
#   post-deploy readiness gate below.
#
# Override the defaults with environment variables, e.g.:
#   NETWORK= HOST_PORT=80 bash deploy/deploy.sh   # standalone VM, no shared edge proxy
#   STACK_COMPOSE= bash deploy/deploy.sh          # ignore the stack file, force docker run
#
set -euo pipefail

IMAGE_NAME="${IMAGE_NAME:-sugar-and-leather}"
# Must match the upstream name in the edge proxy's Caddyfile (`reverse_proxy <name>:80`).
CONTAINER_NAME="${CONTAINER_NAME:-sugar-main-web}"
SERVICE_NAME="${SERVICE_NAME:-${CONTAINER_NAME}}"
# Shared external docker network the edge proxy resolves container names on.
NETWORK="${NETWORK-docker-stack}"
# Empty by default: the edge proxy reaches us over NETWORK, so publishing a host port is
# both unnecessary and an outright conflict with n8n-caddy. Set it only on a VM where
# this container is itself the edge.
HOST_PORT="${HOST_PORT-}"
CONTAINER_PORT=80                # Caddy inside the container listens on :80 (see Caddyfile.container)

# Move to the repository root (this script lives in <repo>/deploy).
cd "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# The shared stack compose file lives one level up on the production VM.
STACK_COMPOSE="${STACK_COMPOSE-$(cd .. 2>/dev/null && pwd)/docker-compose.yml}"

echo "==> Deploying commit $(git rev-parse --short HEAD) ($(git log -1 --pretty=%s))"

# --- rollback snapshot -------------------------------------------------------------
# Capture what is serving right now, BEFORE we replace it.
#
# Deliberately `docker commit` (snapshot the container) rather than `docker tag` (alias
# the container's image id): an image record can be pruned out from under a running
# container, leaving the container alive but its image un-inspectable. That is exactly
# the state the production VM is in today — `sugar-main-web` runs image e961f56e5916,
# which `docker image inspect` reports as "No such image", so tagging it would fail and
# abort the deploy under `set -e`. `docker commit` always works.
snapshot_rollback() {
  if ! docker inspect "${CONTAINER_NAME}" >/dev/null 2>&1; then
    echo "==> No existing ${CONTAINER_NAME} to snapshot (first deploy)"
    return 0
  fi
  if docker commit "${CONTAINER_NAME}" "${IMAGE_NAME}:previous" >/dev/null 2>&1; then
    echo "==> Snapshotted live container as ${IMAGE_NAME}:previous (rollback target)"
  else
    echo "WARNING: could not snapshot ${CONTAINER_NAME}. Continuing, but there will be no" >&2
    echo "         rollback image if this deploy is bad." >&2
  fi
}

# --- readiness gate ----------------------------------------------------------------
# `docker run -d` / `compose up -d` return as soon as the container is CREATED. That is
# precisely how 2026-07-23 failed quietly: the command "succeeded" while the container
# sat in `created` after a port-bind error. Never declare victory without a real request.
wait_until_serving() {
  echo "==> Waiting for ${CONTAINER_NAME} to serve"
  for attempt in $(seq 1 15); do
    status="$(docker inspect --format '{{.State.Status}}' "${CONTAINER_NAME}" 2>/dev/null || echo missing)"
    if [ "${status}" != "running" ]; then
      echo "    attempt ${attempt}: container status=${status}"
      if [ "${attempt}" -eq 15 ]; then
        echo "ERROR: ${CONTAINER_NAME} is '${status}', not running. Deploy failed." >&2
        docker inspect --format '{{.State.Error}}' "${CONTAINER_NAME}" >&2 2>/dev/null || true
        return 1
      fi
      sleep 2
      continue
    fi
    if docker exec "${CONTAINER_NAME}" wget -q -O /dev/null "http://127.0.0.1:${CONTAINER_PORT}/" 2>/dev/null; then
      echo "    container is serving on :${CONTAINER_PORT}"
      return 0
    fi
    echo "    attempt ${attempt}: running but not answering yet"
    if [ "${attempt}" -eq 15 ]; then
      echo "ERROR: ${CONTAINER_NAME} is running but never answered on :${CONTAINER_PORT}." >&2
      return 1
    fi
    sleep 2
  done
}

if [ -f docker-compose.yml ] || [ -f compose.yml ] || [ -f docker-compose.yaml ] || [ -f compose.yaml ]; then
  # Repo-local compose stack.
  echo "==> Repo compose file detected — deploying with docker compose"
  snapshot_rollback
  docker compose up -d --build --remove-orphans
  wait_until_serving

elif [ -n "${STACK_COMPOSE}" ] && [ -f "${STACK_COMPOSE}" ] \
     && docker compose -f "${STACK_COMPOSE}" config --services 2>/dev/null | grep -qx "${SERVICE_NAME}"; then
  # Production path: this repo is a service inside the parent stack's compose file.
  # Deploy through compose so the service keeps its memory limit, healthcheck and
  # network membership, and stays under compose's management.
  echo "==> Service '${SERVICE_NAME}' is managed by ${STACK_COMPOSE} — deploying via that stack"
  snapshot_rollback
  # Scope strictly to our service: no --remove-orphans, which would reap unrelated
  # containers belonging to the rest of the stack.
  docker compose -f "${STACK_COMPOSE}" up -d --build "${SERVICE_NAME}"
  wait_until_serving

else
  # Standalone: plain docker build + run.
  echo "==> No managing compose file found — deploying with plain docker"
  snapshot_rollback

  echo "==> Building image ${IMAGE_NAME}:latest"
  docker build -t "${IMAGE_NAME}:latest" .

  if [ -n "${NETWORK}" ] && ! docker network inspect "${NETWORK}" >/dev/null 2>&1; then
    echo "ERROR: docker network '${NETWORK}' does not exist. The edge proxy resolves this" >&2
    echo "       container by name on that network; deploying without it would take the" >&2
    echo "       site down. Create it, or re-run with NETWORK= to opt out." >&2
    exit 1
  fi

  echo "==> Replacing container ${CONTAINER_NAME}${NETWORK:+ on network ${NETWORK}}${HOST_PORT:+ (host ${HOST_PORT} -> container ${CONTAINER_PORT})}"
  docker rm -f "${CONTAINER_NAME}" 2>/dev/null || true
  docker run -d \
    --name "${CONTAINER_NAME}" \
    --restart unless-stopped \
    ${NETWORK:+--network "${NETWORK}"} \
    ${HOST_PORT:+-p "${HOST_PORT}:${CONTAINER_PORT}"} \
    "${IMAGE_NAME}:latest"

  wait_until_serving
fi

# Deliberately NOT running `docker image prune -f` here. On 2026-07-23 that is what
# destroyed the only copy of the then-live image, leaving production with no rollback
# artifact. `${IMAGE_NAME}:previous` is the rollback target and must survive; prune
# images manually when you have confirmed the deploy is good.

echo "==> Deploy complete"
