#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEPLOY_SCRIPT="${ROOT}/deploy/deploy.sh"
TMP="$(mktemp -d)"
trap 'rm -rf "${TMP}"; rm -f "${ROOT}/.build-commit"' EXIT
mkdir -p "${TMP}/bin"
touch "${TMP}/docker-compose.yml"

TARGET_COMMIT=7cccbb9b3a1a19ab1599ba6df31f5f0978498b34
SERVED_COMMIT=5dee0be1c40c07f53d4c22556ff4420a4d4f0e80

cat > "${TMP}/bin/git" <<'GIT'
#!/usr/bin/env bash
printf '%s\n' "$*" >> "${FAKE_GIT_LOG}"
case "$*" in
  "rev-parse --short HEAD") echo 7d447ae ;;
  "rev-parse HEAD") echo "${FAKE_TARGET_COMMIT}" ;;
  "log -1 --pretty=%s") echo "fixture deploy" ;;
  "cat-file -e ${FAKE_SERVED_COMMIT}^{commit}")
    [ "${FAKE_DEPLOY_FAILURE:-}" != "recovery-object" ]
    ;;
  "merge-base --is-ancestor ${FAKE_SERVED_COMMIT} HEAD")
    [ "${FAKE_DEPLOY_FAILURE:-}" != "recovery-non-ancestor" ]
    ;;
  "archive ${FAKE_SERVED_COMMIT}")
    [ "${FAKE_DEPLOY_FAILURE:-}" != "recovery-archive" ] || exit 46
    tar -cf - --files-from /dev/null
    ;;
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
    if [[ "${FAKE_DEPLOY_FAILURE:-}" = snapshot* || "${FAKE_DEPLOY_FAILURE:-}" = recovery-* ]]; then
      echo "fake docker commit diagnostic" >&2
      exit 41
    fi
    [ "$(state)" != "none" ] || exit 1
    touch "${FAKE_DOCKER_DIR}/rollback-image"
    ;;
  image)
    case "${2:-}" in
      inspect)
        case "${3:-}" in
          --format)
            if [ "${4:-}" = "{{.Id}}" ] \
               && [ "${5:-}" = "sugar-and-leather:previous" ] \
               && [ -f "${FAKE_DOCKER_DIR}/rollback-image" ]; then
              echo sha256:prior-rollback-image
            else
              exit 2
            fi
            ;;
          sha256:live-image) [[ "${FAKE_DEPLOY_FAILURE:-}" != recovery-* ]] ;;
          sugar-and-leather:previous)
            [ -f "${FAKE_DOCKER_DIR}/rollback-image" ] \
              && { [ "${FAKE_DEPLOY_FAILURE:-}" != "recovery-previous-inspect" ] \
                || [ "$(cat "${FAKE_DOCKER_DIR}/rollback-image")" != recovered ]; }
            ;;
          sugar-and-leather:rollback-recovery-*)
            [ "${FAKE_DEPLOY_FAILURE:-}" != "recovery-inspect" ] \
              && [ -f "${FAKE_DOCKER_DIR}/recovery-image" ]
            ;;
          *) exit 2 ;;
        esac
        ;;
      rm)
        case "${3:-}" in
          sugar-and-leather:rollback-recovery-*) rm -f "${FAKE_DOCKER_DIR}/recovery-image" ;;
          *) exit 2 ;;
        esac
        ;;
      prune) ;;
      *) exit 2 ;;
    esac
    ;;
  builder)
    [ "${2:-}" = "prune" ] || exit 2
    ;;
  tag)
    case "${2:-} ${3:-}" in
      "sha256:live-image sugar-and-leather:previous")
        [[ "${FAKE_DEPLOY_FAILURE:-}" != recovery-* ]] || exit 1
        touch "${FAKE_DOCKER_DIR}/rollback-image"
        ;;
      sugar-and-leather:rollback-recovery-*" sugar-and-leather:previous")
        [ -f "${FAKE_DOCKER_DIR}/recovery-image" ] || exit 1
        printf '%s' recovered > "${FAKE_DOCKER_DIR}/rollback-image"
        ;;
      "sha256:prior-rollback-image sugar-and-leather:previous")
        printf '%s' prior-valid > "${FAKE_DOCKER_DIR}/rollback-image"
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
    if [[ " ${*:2} " = *" -t sugar-and-leather:rollback-recovery-"* ]]; then
      context="${!#}"
      [ "${FAKE_DEPLOY_FAILURE:-}" != "recovery-build" ] || exit 45
      [ "$(cat "${context}/.build-commit" 2>/dev/null)" = "${FAKE_SERVED_COMMIT}" ] || exit 47
      touch "${FAKE_DOCKER_DIR}/recovery-image"
      exit 0
    fi
    [ "${FAKE_DEPLOY_FAILURE:-}" != "build" ] || exit 42
    touch "${FAKE_DOCKER_DIR}/replacement-built"
    ;;
  rm)
    [ "$(state)" != "none" ] || exit 1
    set_state none
    ;;
  run)
    if [[ " $* " = *" --network none "* ]] && [[ " $* " = *" --entrypoint cat "* ]]; then
      [ -f "${FAKE_DOCKER_DIR}/recovery-image" ] || exit 1
      [ "${FAKE_DEPLOY_FAILURE:-}" != "recovery-verify" ] || exit 48
      if [ "${FAKE_DEPLOY_FAILURE:-}" = "recovery-identity" ]; then
        commit="${FAKE_TARGET_COMMIT}"
      else
        commit="${FAKE_SERVED_COMMIT}"
      fi
      printf '{\n  "commit": "%s",\n  "builtAt": "2026-08-13T00:00:00.000Z"\n}\n' "${commit}"
      exit 0
    fi
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
    if [ "${3:-}" = "cat" ] && [ "${4:-}" = "/usr/share/caddy/build.json" ]; then
      case "${FAKE_DEPLOY_FAILURE:-}" in
        recovery-malformed) printf '%s\n' '{"commit":"not-a-commit"}' ;;
        recovery-missing) printf '%s\n' '{"builtAt":"2026-08-01T00:00:00.000Z"}' ;;
        recovery-uppercase) printf '%s\n' '{"commit":"5DEE0BE1C40C07F53D4C22556FF4420A4D4F0E80"}' ;;
        recovery-duplicate) printf '%s\n' "{\"commit\":\"${FAKE_SERVED_COMMIT}\",\"commit\":\"bad\"}" ;;
        *) printf '{\n  "commit": "%s",\n  "builtAt": "2026-08-01T00:00:00.000Z"\n}\n' "${FAKE_SERVED_COMMIT}" ;;
      esac
      exit 0
    fi
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

assert_git_logged() {
  local pattern="$1" line
  while IFS= read -r line; do
    [[ "${line}" = *"${pattern}"* ]] && return 0
  done < "${FAKE_GIT_LOG}"
  fail "missing git command: ${pattern}"
}

assert_no_recovery_context() {
  local recovery_context
  recovery_context="$(find "${FAKE_DOCKER_DIR}" -maxdepth 1 -type d -name 'sl-rollback-recovery.*' -print -quit)"
  [ -z "${recovery_context}" ] || fail "temporary recovery context was not removed: ${recovery_context}"
}

assert_exact_logged() {
  local expected="$1" line
  while IFS= read -r line; do
    [ "${line}" = "${expected}" ] && return 0
  done < "${FAKE_DOCKER_LOG}"
  fail "missing exact docker command: ${expected}"
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
  local name="$1" failure="${2:-}" initial_state="${3:-live}" original_command="${4:-}" prior_rollback="${5:-}" status
  export FAKE_DOCKER_DIR="${TMP}/${name}"
  export FAKE_DOCKER_LOG="${FAKE_DOCKER_DIR}/docker.log"
  export FAKE_DOCKER_STATE="${FAKE_DOCKER_DIR}/state"
  export FAKE_GIT_LOG="${FAKE_DOCKER_DIR}/git.log"
  export FAKE_DEPLOY_FAILURE="${failure}"
  export FAKE_TARGET_COMMIT="${TARGET_COMMIT}"
  export FAKE_SERVED_COMMIT="${SERVED_COMMIT}"
  mkdir -p "${FAKE_DOCKER_DIR}"
  : > "${FAKE_GIT_LOG}"
  printf '%s' "${initial_state}" > "${FAKE_DOCKER_STATE}"
  [ -z "${prior_rollback}" ] || printf '%s' "${prior_rollback}" > "${FAKE_DOCKER_DIR}/rollback-image"

  set +e
  PATH="${TMP}/bin:${PATH}" \
    TMPDIR="${FAKE_DOCKER_DIR}" \
    STACK_COMPOSE="${TMP}/docker-compose.yml" \
    SSH_ORIGINAL_COMMAND="${original_command}" \
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
assert_not_logged "image prune"
assert_not_logged "builder prune"

run_case cleanup "" live sl-deploy-cleanup
[ "${CASE_STATUS}" -eq 0 ] || fail "post-verification cleanup exited ${CASE_STATUS}, expected 0"
assert_exact_logged "image prune -f --filter until=168h"
assert_exact_logged "builder prune -af --filter until=168h"
assert_not_logged "image prune -af"
assert_not_logged "commit sugar-main-web"
assert_not_logged "compose -f ${TMP}/docker-compose.yml build sugar-main-web"

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

run_case snapshot-recovery recovery-success
[ "${CASE_STATUS}" -eq 0 ] || fail "served-commit recovery exited ${CASE_STATUS}, expected 0"
[ "$(cat "${FAKE_DOCKER_STATE}")" = replacement ] || fail "served-commit recovery did not leave the replacement serving"
assert_output_contains "fake docker commit diagnostic"
assert_logged "exec sugar-main-web cat /usr/share/caddy/build.json"
assert_git_logged "cat-file -e ${SERVED_COMMIT}^{commit}"
assert_git_logged "merge-base --is-ancestor ${SERVED_COMMIT} HEAD"
assert_git_logged "archive ${SERVED_COMMIT}"
assert_logged "build -t sugar-and-leather:rollback-recovery-"
assert_logged "run --rm --network none --entrypoint cat sugar-and-leather:rollback-recovery-"
assert_before "run --rm --network none --entrypoint cat sugar-and-leather:rollback-recovery-" "tag sugar-and-leather:rollback-recovery-"
assert_logged "image rm -f sugar-and-leather:rollback-recovery-"
assert_no_recovery_context

for failure in recovery-malformed recovery-missing recovery-uppercase recovery-duplicate recovery-object recovery-non-ancestor recovery-archive; do
  run_case "${failure}" "${failure}"
  [ "${CASE_STATUS}" -ne 0 ] || fail "${failure} did not abort"
  [ "$(cat "${FAKE_DOCKER_STATE}")" = live ] || fail "${failure} did not retain the live container"
  assert_not_logged "compose -f ${TMP}/docker-compose.yml build sugar-main-web"
  assert_not_logged "rm -f sugar-main-web"
  assert_no_recovery_context
done

for failure in recovery-build recovery-inspect recovery-verify recovery-identity recovery-previous-inspect; do
  run_case "${failure}" "${failure}" live "" prior-valid
  [ "${CASE_STATUS}" -ne 0 ] || fail "${failure} did not abort"
  [ "$(cat "${FAKE_DOCKER_STATE}")" = live ] || fail "${failure} did not retain the live container"
  [ "$(cat "${FAKE_DOCKER_DIR}/rollback-image")" = prior-valid ] \
    || fail "${failure} replaced the prior valid rollback image"
  assert_not_logged "compose -f ${TMP}/docker-compose.yml build sugar-main-web"
  assert_not_logged "rm -f sugar-main-web"
  assert_logged "image rm -f sugar-and-leather:rollback-recovery-"
  assert_no_recovery_context
done

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
