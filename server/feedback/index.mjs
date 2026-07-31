// Feedback intake for sugarandleather.com.
//
// The site is a static Vite build with no backend, and a Jira API token obviously cannot
// ship to the browser. This is the smallest thing that closes that gap: one endpoint that
// accepts an anonymous report and files it as a Jira issue in SLW.
//
// Deliberately zero runtime dependencies — Node 22 has fetch, crypto and http built in.
// A public write endpoint is an attack surface; fewer packages is less to audit and
// nothing to keep patched.
//
// It is NOT coupled to the Aries feedback service. Aries was the reference for how the
// UX should behave, not a system to call into. This owns its own credentials, its own
// rate limiting and its own Jira project.
//
// Endpoints:
//   POST /api/feedback/submit   file a report
//   GET  /api/feedback/health   liveness (used by the container healthcheck)

import { createHash, randomUUID } from 'node:crypto';
import { createServer } from 'node:http';
import { pathToFileURL } from 'node:url';

const PORT = Number(process.env.PORT || 8080);
const JIRA_BASE_URL = (process.env.JIRA_BASE_URL || '').replace(/\/$/, '');
const JIRA_EMAIL = process.env.JIRA_EMAIL || '';
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN || '';
const JIRA_PROJECT_KEY = process.env.JIRA_PROJECT_KEY || 'SLW';
// Rotating this invalidates every stored rate-limit bucket, which is the intended
// behaviour: the salt exists so raw IPs are never held in memory, not as a secret.
const IP_SALT = process.env.FEEDBACK_IP_SALT || randomUUID();

// A public endpoint that creates Jira issues is a spam cannon if left unbounded.
const RATE_LIMIT_MAX = Number(process.env.FEEDBACK_RATE_LIMIT_MAX || 5);
const RATE_LIMIT_WINDOW_MS = Number(process.env.FEEDBACK_RATE_LIMIT_WINDOW_MS || 60 * 60 * 1000);
// Generous for text, far below anything that would pressure memory.
const MAX_BODY_BYTES = 64 * 1024;

const CATEGORIES = new Set(['bug', 'request', 'question', 'other']);
const IMPACTS = new Map([
  ['p0_blocked', 'Blocked — cannot use the site'],
  ['p1_broken', 'Something is broken'],
  ['p2_degraded', 'Works, but not properly'],
  ['p3_minor', 'Minor or cosmetic'],
  ['p4_idea', 'Idea or general feedback'],
]);
// Bugs become Bugs; everything else is a Task. Both exist in SLW (verified against
// /rest/api/3/issue/createmeta).
const ISSUE_TYPE_FOR = (category) => (category === 'bug' ? 'Bug' : 'Task');

const LIMITS = { title: 255, description: 5000, email: 254, path: 200 };

const configured = Boolean(JIRA_BASE_URL && JIRA_EMAIL && JIRA_API_TOKEN && JIRA_PROJECT_KEY);

// --- rate limiting ------------------------------------------------------------------
// In-memory is the right trade here: one replica, and losing buckets on restart just
// means a generous reset rather than a security hole.
const buckets = new Map();

function rateLimitKey(req) {
  // Behind the edge Caddy, so the socket address is the proxy. X-Forwarded-For's FIRST
  // entry is the client; later entries are proxies. Only trusted because nothing reaches
  // this service except through our own edge — it is not published to the host.
  const fwd = (req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  const ip = fwd || req.socket.remoteAddress || 'unknown';
  return createHash('sha256').update(`${IP_SALT}:${ip}`).digest('hex').slice(0, 32);
}

function overRateLimit(key) {
  const now = Date.now();
  const hits = (buckets.get(key) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (hits.length >= RATE_LIMIT_MAX) {
    buckets.set(key, hits);
    return true;
  }
  hits.push(now);
  buckets.set(key, hits);
  return false;
}

// Unbounded Maps are a slow leak. Sweep expired buckets periodically.
setInterval(() => {
  const now = Date.now();
  for (const [k, hits] of buckets) {
    const live = hits.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    if (live.length) buckets.set(k, live);
    else buckets.delete(k);
  }
}, RATE_LIMIT_WINDOW_MS).unref();

// --- helpers ------------------------------------------------------------------------
const json = (res, status, body) => {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(payload),
    'x-content-type-options': 'nosniff',
    'cache-control': 'no-store',
  });
  res.end(payload);
};

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > MAX_BODY_BYTES) {
        // Pause rather than destroy. Destroying here tears down the socket before the
        // handler can write its 413, so the client sees a connection reset instead of a
        // usable error. Stopping the read is enough; the handler responds and closes.
        req.pause();
        reject(Object.assign(new Error('body_too_large'), { code: 'body_too_large' }));
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

const str = (v) => (typeof v === 'string' ? v.trim() : '');

function validate(obj) {
  const errors = {};
  const category = CATEGORIES.has(obj.category) ? obj.category : 'other';
  const impact = IMPACTS.has(obj.impact) ? obj.impact : null;
  const title = str(obj.title);
  const description = str(obj.description);
  const email = str(obj.email);
  const path = str(obj.path).slice(0, LIMITS.path);

  if (!impact) errors.impact = 'Choose how badly this affects you.';
  if (!title) errors.title = 'Give it a short title.';
  else if (title.length > LIMITS.title) errors.title = `Keep the title under ${LIMITS.title} characters.`;
  if (!description) errors.description = 'Describe what happened.';
  else if (description.length > LIMITS.description)
    errors.description = `Keep the description under ${LIMITS.description} characters.`;
  // Optional, but if given it must look like an address or the reply will bounce.
  if (email && (email.length > LIMITS.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)))
    errors.email = 'That email address does not look right.';

  return { errors, value: { category, impact, title, description, email, path } };
}

// --- Jira ---------------------------------------------------------------------------
// Minimal ADF. Plain text only, and every user string goes in as a text node rather than
// being interpolated into markup, so there is nothing for a reporter to inject.
const para = (text) => ({ type: 'paragraph', content: [{ type: 'text', text }] });

function buildIssue(v) {
  const lines = [
    para(v.description),
    para('—'),
    para(`Category: ${v.category}`),
    para(`Impact: ${IMPACTS.get(v.impact)}`),
    para(`Page: ${v.path || '(not supplied)'}`),
    para(`Reporter email: ${v.email || '(not supplied)'}`),
    para('Submitted anonymously via the feedback button on sugarandleather.com.'),
  ];
  return {
    fields: {
      project: { key: JIRA_PROJECT_KEY },
      issuetype: { name: ISSUE_TYPE_FOR(v.category) },
      summary: `[Website] ${v.title}`.slice(0, LIMITS.title),
      description: { type: 'doc', version: 1, content: lines },
      labels: ['website-feedback', `feedback-${v.category}`],
    },
  };
}

async function createJiraIssue(v) {
  const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');
  const res = await fetch(`${JIRA_BASE_URL}/rest/api/3/issue`, {
    method: 'POST',
    headers: {
      authorization: `Basic ${auth}`,
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify(buildIssue(v)),
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) {
    // Log for operators, but never return Jira's response to the client — it can echo
    // project config and account details.
    const detail = await res.text().catch(() => '');
    console.error(`[feedback] jira create failed ${res.status}: ${detail.slice(0, 500)}`);
    throw new Error(`jira_${res.status}`);
  }
  return res.json();
}

// --- server -------------------------------------------------------------------------
const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');

  if (req.method === 'GET' && url.pathname === '/api/feedback/health') {
    return json(res, configured ? 200 : 503, {
      status: configured ? 'ok' : 'unconfigured',
      project: JIRA_PROJECT_KEY,
    });
  }

  if (url.pathname !== '/api/feedback/submit') return json(res, 404, { status: 'error', error: 'not_found' });
  if (req.method !== 'POST') {
    res.setHeader('allow', 'POST');
    return json(res, 405, { status: 'error', error: 'method_not_allowed' });
  }
  if (!configured) return json(res, 503, { status: 'error', error: 'feedback_unconfigured' });

  const key = rateLimitKey(req);
  if (overRateLimit(key)) {
    res.setHeader('retry-after', String(Math.ceil(RATE_LIMIT_WINDOW_MS / 1000)));
    return json(res, 429, {
      status: 'error',
      error: 'rate_limited',
      message: 'You have sent several reports recently. Please try again later.',
    });
  }

  let parsed;
  try {
    parsed = JSON.parse(await readBody(req));
  } catch (err) {
    if (err?.code === 'body_too_large') {
      // We are answering before the client finished sending, so tell it not to reuse the
      // connection — the unread remainder would otherwise be parsed as the next request.
      res.setHeader('connection', 'close');
      return json(res, 413, { status: 'error', error: 'body_too_large' });
    }
    return json(res, 400, { status: 'error', error: 'invalid_json' });
  }
  if (!parsed || typeof parsed !== 'object') return json(res, 400, { status: 'error', error: 'invalid_json' });

  const { errors, value } = validate(parsed);
  if (Object.keys(errors).length) return json(res, 422, { status: 'error', error: 'invalid_input', fieldErrors: errors });

  try {
    const issue = await createJiraIssue(value);
    console.log(`[feedback] created ${issue.key} (${value.category}/${value.impact})`);
    // Return the key so the UI can show it. It is not sensitive — the reporter cannot
    // read the issue without a Jira account.
    return json(res, 201, { status: 'ok', key: issue.key });
  } catch {
    return json(res, 502, {
      status: 'error',
      error: 'submit_failed',
      message: 'We could not file that just now. Please email contact@sugarandleather.com.',
    });
  }
});

// Only listen when run as a program. Importing this module — to check that the client
// and server enums still agree, or from a test — must not bind a port or leave the
// process alive. A module that starts a server on import cannot be tested.
const isEntrypoint = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isEntrypoint) {
  server.listen(PORT, () => {
    console.log(
      `[feedback] listening on :${PORT} project=${JIRA_PROJECT_KEY} configured=${configured} ` +
        `rateLimit=${RATE_LIMIT_MAX}/${Math.round(RATE_LIMIT_WINDOW_MS / 60000)}min`,
    );
    if (!configured) console.error('[feedback] JIRA_* env incomplete — submissions will 503 until set');
  });

  // Compose sends SIGTERM; exit promptly so deploys are not held up by the keep-alive timer.
  for (const sig of ['SIGTERM', 'SIGINT']) process.on(sig, () => server.close(() => process.exit(0)));
}

export { validate, buildIssue, ISSUE_TYPE_FOR, CATEGORIES, IMPACTS };
