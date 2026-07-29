# Deployment

Production for **sugarandleather.com** is a static build (`vite build` → `dist`) served by
a **Caddy Docker container running on the VM** (see the root `Dockerfile` and
`Caddyfile.container`). There is no Netlify or GitHub Pages hosting — the `netlify.toml`
in the repo root is a leftover and is not used.

## Production topology

This site is **not** the only thing on the VM, it does **not** own host port 80, and it is
**not** a standalone container. It is one service in the shared stack that lives in this
repo's **parent directory**, `~/openclaw-n8n-stack`:

```
~/openclaw-n8n-stack/
├── docker-compose.yml     # defines service `sugar-main-web` (build context: ./sugar-and-leather)
├── Caddyfile              # {$SUGAR_DOMAIN} { reverse_proxy sugar-main-web:80 }
├── .env                   # SUGAR_DOMAIN=sugarandleather.com
└── sugar-and-leather/     # ← this repo (DEPLOY_PATH)
```

The stack's edge proxy container `n8n-caddy` holds ports 80/443 for every
`*.sugarandleather.com` service and routes the apex domain to this site's container **by
name** over the shared external docker network `docker-stack`:

```
internet :443 → n8n-caddy → reverse_proxy sugar-main-web:80 → this repo's container
```

Three rules follow, and violating any of them fails **silently** rather than loudly:

- **Deploy through the stack compose file.** `docker-compose.yml` gives the service its
  `container_name`, memory limit, healthcheck and network. A bare `docker run` creates a
  container outside compose's management, drops those settings, and the next stack-wide
  `docker compose up` fights it.
- **The container must be named `sugar-main-web`.** Deploy under any other name and you
  create a second, unreferenced container while the old one keeps serving traffic — the
  site just never changes.
- **Never publish a host port.** `n8n-caddy` already owns `:80`, so `docker run -p 80:80`
  fails with `port is already allocated` and leaves the new container stuck in `created`.

> All three bit us on 2026-07-23. `deploy.sh` looked for a compose file *inside* this repo
> (there isn't one — it's in the parent), fell through to plain `docker run`, defaulted to
> the container name `sugar-and-leather` and `-p 80:80`. The image built correctly and was
> never installed; `docker rm -f sugar-and-leather` matched nothing, so `sugar-main-web`
> kept serving the 2026-07-06 build for three weeks while the run reported success. The
> same script's `docker image prune -f` then deleted the only copy of the live image,
> leaving production with no rollback artifact.
>
> `deploy.sh` now delegates to the parent stack compose file, snapshots the live container
> before replacing it, refuses to publish a conflicting host port, no longer prunes, and
> blocks until the new container actually answers an HTTP request.

This repo's own `.env`: there isn't one, and none is needed. The site is a static Vite
build with no runtime configuration — all environment lives in the stack-level
`~/openclaw-n8n-stack/.env`, which configures `n8n-caddy`, not this container.

## How deploys work

`.github/workflows/deploy.yml` runs on every push to `main` (and can be triggered manually
from the Actions tab). It:

1. SSHes into the VM.
2. Syncs the checkout there to the merged commit (`git reset --hard origin/main`).
3. Runs [`deploy/deploy.sh`](./deploy.sh), which rebuilds the Docker image and restarts the container.
4. Curls the live site and fails the run if it doesn't return `HTTP 200`.

> Before this workflow existed, a push to `main` did nothing to the live site — the VM
> container had to be rebuilt by hand. That's why merged changes could sit undeployed.

## One-time setup

### 1. Create a deploy SSH key

On your machine:

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f deploy_key -N ""
```

- Add the **public** key (`deploy_key.pub`) to the VM user's `~/.ssh/authorized_keys`.
- The **private** key (`deploy_key`) goes into the `DEPLOY_SSH_KEY` secret below.

### 2. Make sure the repo is checked out on the VM

The workflow expects a git checkout at `DEPLOY_PATH` whose `origin` is this repo. The
checkout must be **owned by `DEPLOY_USER`** — the workflow runs `git reset --hard` and the
deploy script as that user, so a root-owned checkout (e.g. from `sudo git clone`) will fail
with permission errors. Create it owned by the deploy user:

On the current production VM this checkout already exists at:

```
/home/node/openclaw-n8n-stack/sugar-and-leather
```

That is the value to use for `DEPLOY_PATH`. It sits inside the shared stack directory
alongside the `Caddyfile` and `.env` that route traffic to it. (There is an unrelated
`/home/node/openclaw-n8n-stack/sugarandleather.com` directory — an older Next.js project —
and a `/srv/dev-sugarandleather`; neither is this site. Don't point `DEPLOY_PATH` at either.)

If you ever need to create the checkout from scratch on a new VM:

```bash
# Run as DEPLOY_USER, or chown the directory to DEPLOY_USER afterwards.
git clone https://github.com/DeliciousHouse/sugar-and-leather.git ~/openclaw-n8n-stack/sugar-and-leather
```

The SSH user must also be able to run `docker` (typically by being in the `docker` group).

### 3. Add repository secrets

**Settings → Secrets and variables → Actions → New repository secret:**

| Secret | Required | Description |
| --- | --- | --- |
| `DEPLOY_HOST` | ✅ | VM hostname or IP |
| `DEPLOY_USER` | ✅ | SSH user (must be able to run `docker`) |
| `DEPLOY_SSH_KEY` | ✅ | Contents of the private `deploy_key` |
| `DEPLOY_PATH` | ✅ | Absolute path to the checkout on the VM — currently `/home/node/openclaw-n8n-stack/sugar-and-leather` |
| `DEPLOY_KNOWN_HOSTS` | ✅ | VM SSH host key(s), so each run verifies the server and can't be MITM'd |
| `DEPLOY_PORT` | optional | SSH port (defaults to `22`) |

Get `DEPLOY_KNOWN_HOSTS` by running this from a trusted network (ideally on the VM itself):

```bash
ssh-keyscan -H your.vm.host        # add -p PORT if not on 22
```

It's required: the workflow uses strict host-key checking and fails preflight if it's
missing. There is intentionally no `ssh-keyscan` fallback in CI — runners are ephemeral, so
scanning at deploy time would re-trust the host blindly every run and provide no protection.

**Optional repository variable** (Variables tab, not Secrets): `HEALTHCHECK_URL` — defaults
to `https://sugarandleather.com/`.

### 4. Trigger it

Push to `main`, or run **Actions → Deploy to production → Run workflow**.

## Adapting to your VM

`deploy/deploy.sh` picks its strategy in this order:

1. **Repo-local compose** — if a `docker-compose.yml` / `compose.yml` exists at this repo's
   root, use it.
2. **Parent stack compose** *(the production path)* — if `../docker-compose.yml` defines a
   service matching `SERVICE_NAME`, deploy through it, scoped to just that service.
3. **Plain docker** — otherwise `docker build` + `docker run` with the settings below.

Every path snapshots the outgoing container to `sugar-and-leather:previous` first, then
blocks until the new one answers a real HTTP request. Override via env vars:

| Variable | Default | When to change it |
| --- | --- | --- |
| `CONTAINER_NAME` | `sugar-main-web` | Only if the edge `Caddyfile` upstream name changes — they must match |
| `SERVICE_NAME` | *(same as `CONTAINER_NAME`)* | If the compose service key differs from the container name |
| `STACK_COMPOSE` | `../docker-compose.yml` | Set empty to ignore the stack file and force the plain-docker path |
| `NETWORK` | `docker-stack` | Set empty (`NETWORK=`) on a standalone VM with no shared edge proxy |
| `HOST_PORT` | *(unset — no publish)* | Set (e.g. `HOST_PORT=8080`) only when this container is itself the edge |
| `IMAGE_NAME` | `sugar-and-leather` | Rarely |

- **Standalone VM** (this container is the edge):
  `STACK_COMPOSE= NETWORK= HOST_PORT=80 bash deploy/deploy.sh`

## Deploying by hand

If you ever need to deploy manually on the VM:

```bash
cd ~/openclaw-n8n-stack/sugar-and-leather   # your DEPLOY_PATH
git pull origin main
bash deploy/deploy.sh
```

## Rolling back

`deploy.sh` snapshots the outgoing container to `sugar-and-leather:previous` (via
`docker commit`) before each deploy, so a bad deploy reverts without a rebuild:

```bash
docker rm -f sugar-main-web
docker run -d --name sugar-main-web --restart unless-stopped \
  --network docker-stack sugar-and-leather:previous
```

It snapshots the **container**, not the image id, on purpose. An image record can be pruned
out from under a running container — the container keeps serving, but `docker image inspect`
on its image reports `No such image`, so `docker tag` would fail and abort the deploy. That
is not hypothetical: it is the state the VM was left in after 2026-07-23, which is why the
first deploy after that incident had no rollback artifact until one was committed by hand.

## Verifying a deploy actually landed

The container serves an SPA with `try_files {path} {path}/ /index.html`, so **a missing file
returns HTTP 200 with the HTML shell** instead of a 404. Status codes alone cannot tell you
whether a deploy worked. Check content types instead:

```bash
curl -sS https://sugarandleather.com/robots.txt          # must print "User-agent: *", not HTML
curl -sSI https://sugarandleather.com/sitemap.xml | grep -i content-type   # must be text/xml
```

Also confirm the served bundle hash changed:

```bash
curl -sS https://sugarandleather.com/ | grep -o 'assets/index-[A-Za-z0-9_-]*\.js'
```
