# Deployment

Production for **sugarandleather.com** is a static build (`vite build` → `dist`) served by
a **Caddy Docker container running on the VM** (see the root `Dockerfile` and
`Caddyfile.container`). There is no Netlify or GitHub Pages hosting — the `netlify.toml`
in the repo root is a leftover and is not used.

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

The workflow expects a git checkout at `DEPLOY_PATH` whose `origin` is this repo, e.g.:

```bash
sudo git clone https://github.com/DeliciousHouse/sugar-and-leather.git /srv/sugar-and-leather
```

The SSH user must be able to run `docker` (typically by being in the `docker` group).

### 3. Add repository secrets

**Settings → Secrets and variables → Actions → New repository secret:**

| Secret | Required | Description |
| --- | --- | --- |
| `DEPLOY_HOST` | ✅ | VM hostname or IP |
| `DEPLOY_USER` | ✅ | SSH user (must be able to run `docker`) |
| `DEPLOY_SSH_KEY` | ✅ | Contents of the private `deploy_key` |
| `DEPLOY_PATH` | ✅ | Absolute path to the checkout on the VM, e.g. `/srv/sugar-and-leather` |
| `DEPLOY_PORT` | optional | SSH port (defaults to `22`) |
| `DEPLOY_KNOWN_HOSTS` | recommended | VM host key(s) so SSH can verify the server |

Get `DEPLOY_KNOWN_HOSTS` with:

```bash
ssh-keyscan -H your.vm.host        # add -p PORT if not on 22
```

If you omit it, the workflow falls back to trust-on-first-connect and logs a warning.

**Optional repository variable** (Variables tab, not Secrets): `HEALTHCHECK_URL` — defaults
to `https://sugarandleather.com/`.

### 4. Trigger it

Push to `main`, or run **Actions → Deploy to production → Run workflow**.

## Adapting to your VM

`deploy/deploy.sh` defaults to a single `docker build` + `docker run` on host port `80`
(matching the repo's one Dockerfile). Adjust as needed:

- **Different host port** (e.g. a reverse proxy already owns `80`):
  set it at the top of `deploy.sh` or run `HOST_PORT=8080 bash deploy/deploy.sh`.
- **docker compose:** if a `docker-compose.yml` / `compose.yml` exists at the repo root,
  `deploy.sh` automatically uses `docker compose up -d --build` instead.

## Deploying by hand

If you ever need to deploy manually on the VM:

```bash
cd /srv/sugar-and-leather   # your DEPLOY_PATH
git pull origin main
bash deploy/deploy.sh
```
