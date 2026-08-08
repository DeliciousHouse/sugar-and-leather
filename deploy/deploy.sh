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

# --- build fingerprint -------------------------------------------------------------
# Stamp the commit into the build context so the built site can say which commit it is.
# scripts/seo-build.mjs reads this file and writes dist/build.json; deploy.yml then
# asserts production serves that exact commit.
#
# This has to happen HERE, not in the build, because the image build runs in Docker and
# .dockerignore excludes .git — `git rev-parse` is impossible inside the container. This
# script is the last point that has both the git checkout and the build context.
#
# The file is gitignored and rewritten on every deploy, including the manual
# `bash deploy/deploy.sh` path, so it can never go stale behind a real deploy.
git rev-parse HEAD > .build-commit
echo "==> Stamped .build-commit $(cat .build-commit)"

# --- rollback snapshot -------------------------------------------------------------
# Capture what is serving right now, BEFORE we replace it.
#
# Deliberately `docker commit` (snapshot the container) rather than `docker tag` (alias
# the container's image id): an image record can be pruned out from under a running
# container, leaving the container alive but its image un-inspectable. Verify the new
# snapshot before proceeding; replacing a live container without a usable rollback image
# turns an ordinary deploy failure into an outage.
ROLLBACK_AVAILABLE=no
COMPOSE_IMAGE="${IMAGE_NAME}:latest"
snapshot_rollback() {
  if ! docker inspect "${CONTAINER_NAME}" >/dev/null 2>&1; then
    echo "==> No existing ${CONTAINER_NAME} to snapshot (first deploy)"
    return 0
  fi
  if ! docker commit "${CONTAINER_NAME}" "${IMAGE_NAME}:previous" >/dev/null 2>&1 \
     || ! docker image inspect "${IMAGE_NAME}:previous" >/dev/null 2>&1; then
    echo "ERROR: could not capture a usable rollback image from ${CONTAINER_NAME}." >&2
    echo "       The live container was not changed." >&2
    return 1
  fi
  ROLLBACK_AVAILABLE=yes
  echo "==> Snapshotted live container as ${IMAGE_NAME}:previous (rollback target)"
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

remove_current_container() {
  if [ "${ROLLBACK_AVAILABLE}" = yes ]; then
    docker rm -f "${CONTAINER_NAME}"
  else
    docker rm -f "${CONTAINER_NAME}" >/dev/null 2>&1 || true
  fi
}

restore_compose_rollback() {
  local cause="$1"
  echo "ERROR: ${cause}; restoring ${IMAGE_NAME}:previous" >&2
  if [ "${ROLLBACK_AVAILABLE}" != yes ]; then
    echo "ERROR: no previous container existed, so there is no rollback target." >&2
    return 1
  fi

  docker rm -f "${CONTAINER_NAME}" >/dev/null 2>&1 || true
  if ! docker tag "${IMAGE_NAME}:previous" "${COMPOSE_IMAGE}" \
     || ! "${COMPOSE_COMMAND[@]}" up -d --no-build --force-recreate "${COMPOSE_SERVICES[@]}" \
     || ! wait_until_serving; then
    echo "ERROR: automatic rollback failed; ${CONTAINER_NAME} requires immediate recovery." >&2
    return 1
  fi
  echo "==> Restored ${CONTAINER_NAME} from ${IMAGE_NAME}:previous" >&2
  return 1
}

deploy_compose() {
  if [ "${#COMPOSE_SERVICES[@]}" -eq 1 ]; then
    COMPOSE_IMAGE="$("${COMPOSE_COMMAND[@]}" config --images "${COMPOSE_SERVICES[0]}")"
    if [ -z "${COMPOSE_IMAGE}" ] || [[ "${COMPOSE_IMAGE}" = *$'\n'* ]]; then
      echo "ERROR: could not resolve one Compose image for ${COMPOSE_SERVICES[0]}." >&2
      return 1
    fi
  fi

  snapshot_rollback

  # Build while the current container is still serving. Compose cannot adopt an
  # identically named container that predates its project labels, so remove that
  # container only after the replacement image and rollback target both exist.
  "${COMPOSE_COMMAND[@]}" build "${COMPOSE_SERVICES[@]}"
  remove_current_container

  if ! "${COMPOSE_COMMAND[@]}" up -d --no-build --force-recreate \
       "${COMPOSE_UP_OPTIONS[@]}" "${COMPOSE_SERVICES[@]}"; then
    restore_compose_rollback "compose could not start the replacement"
  fi
  if ! wait_until_serving; then
    restore_compose_rollback "the replacement failed its readiness check"
  fi
}

run_standalone_container() {
  local image="$1"
  local -a run_options=(--name "${CONTAINER_NAME}" --restart unless-stopped)
  [ -z "${NETWORK}" ] || run_options+=(--network "${NETWORK}")
  [ -z "${HOST_PORT}" ] || run_options+=(-p "${HOST_PORT}:${CONTAINER_PORT}")
  docker run -d "${run_options[@]}" "${image}"
}

restore_standalone_rollback() {
  local cause="$1"
  echo "ERROR: ${cause}; restoring ${IMAGE_NAME}:previous" >&2
  if [ "${ROLLBACK_AVAILABLE}" != yes ]; then
    echo "ERROR: no previous container existed, so there is no rollback target." >&2
    return 1
  fi

  docker rm -f "${CONTAINER_NAME}" >/dev/null 2>&1 || true
  if ! run_standalone_container "${IMAGE_NAME}:previous" || ! wait_until_serving; then
    echo "ERROR: automatic rollback failed; ${CONTAINER_NAME} requires immediate recovery." >&2
    return 1
  fi
  echo "==> Restored ${CONTAINER_NAME} from ${IMAGE_NAME}:previous" >&2
  return 1
}

if [ -f docker-compose.yml ] || [ -f compose.yml ] || [ -f docker-compose.yaml ] || [ -f compose.yaml ]; then
  # Repo-local compose stack.
  echo "==> Repo compose file detected — deploying with docker compose"
  COMPOSE_COMMAND=(docker compose)
  COMPOSE_SERVICES=()
  COMPOSE_UP_OPTIONS=(--remove-orphans)
  deploy_compose

elif [ -n "${STACK_COMPOSE}" ] && [ -f "${STACK_COMPOSE}" ] \
     && docker compose -f "${STACK_COMPOSE}" config --services 2>/dev/null | grep -qx "${SERVICE_NAME}"; then
  # Production path: this repo is a service inside the parent stack's compose file.
  # Deploy through compose so the service keeps its memory limit, healthcheck and
  # network membership, and stays under compose's management.
  echo "==> Service '${SERVICE_NAME}' is managed by ${STACK_COMPOSE} — deploying via that stack"
  COMPOSE_COMMAND=(docker compose -f "${STACK_COMPOSE}")
  COMPOSE_SERVICES=("${SERVICE_NAME}")
  # Scope strictly to our service: no --remove-orphans, which would reap unrelated
  # containers belonging to the rest of the stack.
  COMPOSE_UP_OPTIONS=()
  deploy_compose

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
  remove_current_container
  if ! run_standalone_container "${IMAGE_NAME}:latest"; then
    restore_standalone_rollback "docker could not start the replacement"
  fi

  if ! wait_until_serving; then
    restore_standalone_rollback "the replacement failed its readiness check"
  fi
fi

# Deliberately NOT running `docker image prune -f` here. On 2026-07-23 that is what
# destroyed the only copy of the then-live image, leaving production with no rollback
# artifact. `${IMAGE_NAME}:previous` is the rollback target and must survive; prune
# images manually when you have confirmed the deploy is good.

echo "==> Deploy complete"
