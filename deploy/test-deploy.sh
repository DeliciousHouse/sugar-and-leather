#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEPLOY_SCRIPT="${ROOT}/deploy/deploy.sh"
TMP="$(mktemp -d)"
trap 'rm -rf "${TMP}"; rm -f "${ROOT}/.build-commit"' EXIT
mkdir -p "${TMP}/bin"
touch "${TMP}/docker-compose.yml"

cat > "${TMP}/bin/git" <<'GIT'
#!/usr/bin/env bash
case "$*" in
  "rev-parse --short HEAD") echo 7d447ae ;;
  "rev-parse HEAD") echo 7d447ae08e012c57f19eb91c81fd6b0b6452ad56 ;;
  "log -1 --pretty=%s") echo "fixture deploy" ;;
  *) exit 2 ;;
esac
GIT
chmod +x "${TMP}/bin/git"

cat > "${TMP}/bin/docker" <<'DOCKER'
#!/usr/bin/env bash
set -u
printf '%s\n' "$*" >> "${FAKE_DOCKER_LOG}"
state() { cat "${FAKE_DOCKER_STATE}"; }
set_state() { printf '%s' "$1" > "${FAKE_DOCKER_STATE}"; }

case "${1:-}" in
  inspect)
    shift
    if [ "${1:-}" = "--format" ]; then
      format="${2:-}"
      current="$(state)"
      [ "${current}" != "none" ] || exit 1
      case "${format}" in
        *State.Status*) printf '%s\n' running ;;
        *State.Error*) printf '\n' ;;
        *.Image*) printf '%s\n' sha256:live-image ;;
      esac
    else
      [ "$(state)" != "none" ]
    fi
    ;;
  commit)
    if [[ "${FAKE_DEPLOY_FAILURE:-}" = snapshot* ]]; then
      echo "fake docker commit diagnostic" >&2
      exit 41
    fi
    [ "$(state)" != "none" ] || exit 1
    touch "${FAKE_DOCKER_DIR}/rollback-image"
    ;;
  image)
    [ "${2:-}" = "inspect" ] || exit 2
    case "${3:-}" in
      sha256:live-image) [ "${FAKE_DEPLOY_FAILURE:-}" != "snapshot-no-image" ] ;;
      sugar-and-leather:previous) [ -f "${FAKE_DOCKER_DIR}/rollback-image" ] ;;
      *) exit 2 ;;
    esac
    ;;
  tag)
    case "${2:-} ${3:-}" in
      "sha256:live-image sugar-and-leather:previous")
        [ "${FAKE_DEPLOY_FAILURE:-}" != "snapshot-no-image" ] || exit 1
        touch "${FAKE_DOCKER_DIR}/rollback-image"
        ;;
      "sugar-and-leather:previous openclaw-n8n-stack-sugar-main-web")
        [ -f "${FAKE_DOCKER_DIR}/rollback-image" ] || exit 1
        touch "${FAKE_DOCKER_DIR}/rollback-selected"
        ;;
      *) exit 2 ;;
    esac
    ;;
  network)
    [ "${2:-}" = "inspect" ]
    ;;
  build)
    [ "${FAKE_DEPLOY_FAILURE:-}" != "build" ] || exit 42
    touch "${FAKE_DOCKER_DIR}/replacement-built"
    ;;
  rm)
    [ "$(state)" != "none" ] || exit 1
    set_state none
    ;;
  run)
    if [ "${FAKE_DEPLOY_FAILURE:-}" = "start" ] \
       && [ ! -f "${FAKE_DOCKER_DIR}/rollback-selected" ] \
       && [ ! -f "${FAKE_DOCKER_DIR}/start-failed" ]; then
      touch "${FAKE_DOCKER_DIR}/start-failed"
      exit 43
    fi
    if [ -f "${FAKE_DOCKER_DIR}/rollback-selected" ] || [[ " $* " = *" sugar-and-leather:previous "* ]]; then
      set_state rollback
    else
      set_state replacement
    fi
    ;;
  exec)
    if [ "$(state)" = "replacement" ] && [ "${FAKE_DEPLOY_FAILURE:-}" = "health" ]; then
      exit 44
    fi
    [ "$(state)" != "none" ]
    ;;
  compose)
    shift
    if [ "${1:-}" = "-f" ]; then
      shift 2
    fi
    command="${1:-}"
    shift || true
    case "${command}" in
      config)
        case "$*" in
          "--services") printf '%s\n' sugar-main-web ;;
          "--images sugar-main-web") printf '%s\n' openclaw-n8n-stack-sugar-main-web ;;
          *) exit 2 ;;
        esac
        ;;
      build)
        [ "${FAKE_DEPLOY_FAILURE:-}" != "build" ] || exit 42
        touch "${FAKE_DOCKER_DIR}/replacement-built"
        ;;
      up)
        if [[ " $* " = *" --build "* ]]; then
          [ "${FAKE_DEPLOY_FAILURE:-}" != "build" ] || exit 42
          touch "${FAKE_DOCKER_DIR}/replacement-built"
        fi
        if [ "$(state)" != "none" ]; then
          echo 'Conflict. The container name "/sugar-main-web" is already in use.' >&2
          exit 17
        fi
        if [ "${FAKE_DEPLOY_FAILURE:-}" = "start" ] \
           && [ ! -f "${FAKE_DOCKER_DIR}/rollback-selected" ] \
           && [ ! -f "${FAKE_DOCKER_DIR}/start-failed" ]; then
          touch "${FAKE_DOCKER_DIR}/start-failed"
          exit 43
        fi
        if [ -f "${FAKE_DOCKER_DIR}/rollback-selected" ]; then
          set_state rollback
        else
          set_state replacement
        fi
        ;;
      *) exit 2 ;;
    esac
    ;;
  *) exit 2 ;;
esac
DOCKER
chmod +x "${TMP}/bin/docker"

cat > "${TMP}/bin/sleep" <<'SLEEP'
#!/usr/bin/env bash
exit 0
SLEEP
chmod +x "${TMP}/bin/sleep"

fail() {
  echo "test-deploy: FAIL: $*" >&2
  if [ -f "${FAKE_DOCKER_DIR:-}/output" ]; then
    while IFS= read -r line; do
      echo "  deploy: ${line}" >&2
    done < "${FAKE_DOCKER_DIR}/output"
  fi
  exit 1
}

line_of() {
  local pattern="$1" number=0 line
  while IFS= read -r line; do
    number=$((number + 1))
    if [[ "${line}" = *"${pattern}"* ]]; then
      printf '%s\n' "${number}"
      return 0
    fi
  done < "${FAKE_DOCKER_LOG}"
  return 1
}

assert_logged() {
  line_of "$1" >/dev/null || fail "missing docker command: $1"
}

assert_not_logged() {
  if line_of "$1" >/dev/null; then
    fail "unexpected docker command: $1"
  fi
}

assert_output_contains() {
  local output
  output="$(cat "${FAKE_DOCKER_DIR}/output")"
  [[ "${output}" = *"$1"* ]] || fail "missing deploy output: $1"
}

assert_before() {
  local first second
  first="$(line_of "$1")" || fail "missing docker command: $1"
  second="$(line_of "$2")" || fail "missing docker command: $2"
  [ "${first}" -lt "${second}" ] || fail "expected '$1' before '$2'"
}

run_case() {
  local name="$1" failure="${2:-}" initial_state="${3:-live}" status
  export FAKE_DOCKER_DIR="${TMP}/${name}"
  export FAKE_DOCKER_LOG="${FAKE_DOCKER_DIR}/docker.log"
  export FAKE_DOCKER_STATE="${FAKE_DOCKER_DIR}/state"
  export FAKE_DEPLOY_FAILURE="${failure}"
  mkdir -p "${FAKE_DOCKER_DIR}"
  printf '%s' "${initial_state}" > "${FAKE_DOCKER_STATE}"

  set +e
  PATH="${TMP}/bin:${PATH}" \
    STACK_COMPOSE="${TMP}/docker-compose.yml" \
    bash "${DEPLOY_SCRIPT}" >"${FAKE_DOCKER_DIR}/output" 2>&1
  status=$?
  set -e
  CASE_STATUS="${status}"
}

run_case success
[ "${CASE_STATUS}" -eq 0 ] || fail "existing-container deploy exited ${CASE_STATUS}, expected 0"
[ "$(cat "${FAKE_DOCKER_STATE}")" = replacement ] || fail "replacement was not left serving"
assert_before "commit sugar-main-web sugar-and-leather:previous" "image inspect sugar-and-leather:previous"
assert_before "image inspect sugar-and-leather:previous" "compose -f ${TMP}/docker-compose.yml build sugar-main-web"
assert_before "compose -f ${TMP}/docker-compose.yml build sugar-main-web" "rm -f sugar-main-web"
assert_before "rm -f sugar-main-web" "compose -f ${TMP}/docker-compose.yml up -d --no-build --force-recreate sugar-main-web"
assert_before "compose -f ${TMP}/docker-compose.yml up -d --no-build --force-recreate sugar-main-web" "exec sugar-main-web wget"

run_case first-deploy "" none
[ "${CASE_STATUS}" -eq 0 ] || fail "first deploy exited ${CASE_STATUS}, expected 0"
[ "$(cat "${FAKE_DOCKER_STATE}")" = replacement ] || fail "first deploy did not leave the replacement serving"
assert_not_logged "commit sugar-main-web"

run_case snapshot-fallback snapshot
[ "${CASE_STATUS}" -eq 0 ] || fail "inspectable live-image fallback exited ${CASE_STATUS}, expected 0"
[ "$(cat "${FAKE_DOCKER_STATE}")" = replacement ] || fail "fallback deploy did not leave the replacement serving"
assert_output_contains "fake docker commit diagnostic"
assert_logged "inspect --format {{.Image}} sugar-main-web"
assert_before "image inspect sha256:live-image" "tag sha256:live-image sugar-and-leather:previous"
assert_before "tag sha256:live-image sugar-and-leather:previous" "image inspect sugar-and-leather:previous"

run_case rollback-capture-failure snapshot-no-image
[ "${CASE_STATUS}" -ne 0 ] || fail "unusable snapshot and live image did not abort"
[ "$(cat "${FAKE_DOCKER_STATE}")" = live ] || fail "rollback capture failure did not retain the live container"
assert_output_contains "fake docker commit diagnostic"
assert_not_logged "compose -f ${TMP}/docker-compose.yml build sugar-main-web"
assert_not_logged "rm -f sugar-main-web"
assert_not_logged "compose -f ${TMP}/docker-compose.yml up"

run_case build-failure build
[ "${CASE_STATUS}" -ne 0 ] || fail "build failure did not propagate"
[ "$(cat "${FAKE_DOCKER_STATE}")" = live ] || fail "build failure did not retain the live container"
assert_logged "compose -f ${TMP}/docker-compose.yml build sugar-main-web"
assert_not_logged "rm -f sugar-main-web"

for failure in start health; do
  run_case "${failure}-failure" "${failure}"
  [ "${CASE_STATUS}" -ne 0 ] || fail "${failure} failure did not propagate after rollback"
  [ "$(cat "${FAKE_DOCKER_STATE}")" = rollback ] || fail "${failure} failure did not restore the rollback image"
  assert_logged "tag sugar-and-leather:previous openclaw-n8n-stack-sugar-main-web"
  assert_logged "compose -f ${TMP}/docker-compose.yml up -d --no-build --force-recreate sugar-main-web"
done

echo "test-deploy: PASS"
