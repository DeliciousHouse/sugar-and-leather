#!/usr/bin/env node
//
// Post-build SEO generator. Runs after `vite build`, over `dist/`.
//
// Why this exists: the site is a client-rendered SPA with no server-side rendering, so
// every URL used to serve one identical <title> and <meta description> and nothing else.
// Google can execute JS and would eventually see the runtime-updated head, but social
// scrapers (Slack, LinkedIn, X, iMessage) do not execute JS at all — every share of every
// page rendered the same generic card. Prerendering a real HTML file per route fixes both
// audiences without adding a headless browser or an SSR framework to the build.
//
// It writes, all from the single table in src/data/seo.js:
//   dist/<route>/index.html   head-complete HTML per route (React still hydrates over it)
//   dist/sitemap.xml          with <lastmod>
//   dist/robots.txt
//   dist/llms.txt
//
// Serving note: the container's Caddyfile uses `try_files {path} {path}/ /index.html`, so
// a request for /about matches the dist/about directory and file_server serves the
// index.html inside it. Unmatched paths still fall through to the SPA shell. No Caddy
// change was needed.

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  ORGANIZATION,
  ROUTES,
  SITE,
  canonicalFor,
  indexableRoutes,
  titleFor,
} from '../src/data/seo.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');

const escapeHtml = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Date only (no time): a sitemap <lastmod> that changes on every rebuild teaches crawlers
// the timestamp is meaningless. Date granularity matches how often content actually moves.
const BUILD_DATE = new Date().toISOString().slice(0, 10);

function headFor(route) {
  const title = titleFor(route);
  const canonical = canonicalFor(route);
  const image = `${SITE.origin}${route.image ?? SITE.defaultImage}`;
  const indexable = route.index !== false;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: route.description,
    url: canonical,
    isPartOf: { '@type': 'WebSite', name: SITE.name, url: `${SITE.origin}/` },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      legalName: ORGANIZATION.legalName,
      url: `${SITE.origin}/`,
      email: ORGANIZATION.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: ORGANIZATION.street,
        addressLocality: ORGANIZATION.locality,
        addressRegion: ORGANIZATION.region,
        postalCode: ORGANIZATION.postalCode,
        addressCountry: ORGANIZATION.country,
      },
    },
  };

  return [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(route.description)}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    `<meta name="robots" content="${indexable ? 'index, follow' : 'noindex, follow'}" />`,
    `<meta property="og:type" content="${route.path === '/' ? 'website' : 'article'}" />`,
    `<meta property="og:site_name" content="${escapeHtml(SITE.name)}" />`,
    `<meta property="og:locale" content="${SITE.locale}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(route.description)}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta name="twitter:card" content="${SITE.twitterCard}" />`,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(route.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    // Escape "<" so a description that ever contains "</script>" cannot close the block
    // early. Inside a <script> element the browser scans for the literal closing tag
    // before any JSON parsing happens, so HTML-escaping would corrupt the JSON instead —
    // \u003c is valid JSON and renders as "<".
    `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`,
  ].join('\n    ');
}

/** Strip the head tags Vite emitted from index.html so ours are the only copy. */
function stripExisting(html) {
  return html
    .replace(/\s*<title>[\s\S]*?<\/title>/i, '')
    .replace(/\s*<meta\s+name="description"[^>]*>/i, '');
}

async function buildPages(shell) {
  const stripped = stripExisting(shell);
  for (const route of ROUTES) {
    const html = stripped.replace('</head>', `  ${headFor(route)}\n  </head>`);
    // "/" is dist/index.html; "/about" is dist/about/index.html.
    const outPath =
      route.path === '/' ? join(DIST, 'index.html') : join(DIST, route.path, 'index.html');
    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, html, 'utf8');
  }
  console.log(`  ${ROUTES.length} route pages written`);
}

async function buildSitemap() {
  const entries = indexableRoutes()
    .map((r) =>
      [
        '  <url>',
        `    <loc>${canonicalFor(r)}</loc>`,
        `    <lastmod>${BUILD_DATE}</lastmod>`,
        `    <changefreq>${r.changefreq}</changefreq>`,
        `    <priority>${r.priority.toFixed(1)}</priority>`,
        '  </url>',
      ].join('\n'),
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
  await writeFile(join(DIST, 'sitemap.xml'), xml, 'utf8');
  console.log(`  sitemap.xml: ${indexableRoutes().length} URLs`);
}

// The deploy verifier needs one artifact that changes on EVERY commit. The bundle
// filename cannot do it: Vite hashes bundles by content, so a commit that only touches
// static payload (public/assets images, robots/llms text, favicons, fonts) rebuilds to a
// byte-identical bundle name. deploy.yml then compares that name against what production
// already serves, they match, and the check passes without proving the deploy ran at all.
// Removing 1.5MB of unused logos in #22 is exactly that case.
//
// The commit SHA is deterministic per commit and changes every time, so asserting on it
// closes the whole class rather than one instance. Resolution order matters because the
// production build runs INSIDE Docker, where .git does not exist (.dockerignore excludes
// it): deploy/deploy.sh writes .build-commit into the build context before building, and
// that is the value that reaches production. The env var is an escape hatch for other
// build systems; the git call only ever fires for a local `npm run build`.
//
// builtAt is for humans reading the file. Never assert on it — CI and the VM build the
// same commit at different times.
function resolveCommit() {
  const fromEnv = process.env.BUILD_COMMIT || process.env.GITHUB_SHA;
  if (fromEnv?.trim()) return fromEnv.trim();

  try {
    return readFileSync(join(ROOT, '.build-commit'), 'utf8').trim();
  } catch {
    /* not a deploy build */
  }

  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();
  } catch {
    // No env var, no .build-commit, no git. Emit "unknown" rather than throwing: a local
    // build from a tarball is legitimate. deploy.yml refuses to accept "unknown" as a
    // match, so an unfingerprinted build fails the gate instead of passing it silently.
    return 'unknown';
  }
}

async function buildBuildInfo() {
  const commit = resolveCommit();
  const json = JSON.stringify({ commit, builtAt: new Date().toISOString() }, null, 2);
  await writeFile(join(DIST, 'build.json'), `${json}\n`, 'utf8');
  console.log(`  build.json: ${commit}`);
}

async function buildRobots() {
  const txt = `User-agent: *
Allow: /

Sitemap: ${SITE.origin}/sitemap.xml
`;
  await writeFile(join(DIST, 'robots.txt'), txt, 'utf8');
  console.log('  robots.txt');
}

async function buildLlms() {
  const GROUPS = [
    ['ecosystem', 'Ecosystem'],
    ['pod', 'Strategic CXO team pods'],
    ['practice', 'Practices'],
    ['company', 'Company'],
  ];

  const home = ROUTES.find((r) => r.path === '/');
  const lines = [
    `# ${SITE.name}`,
    '',
    `> ${home.description}`,
    '',
  ];

  for (const [group, heading] of GROUPS) {
    const inGroup = indexableRoutes().filter((r) => r.group === group && r.path !== '/');
    if (!inGroup.length) continue;
    lines.push(`## ${heading}`, '');
    for (const r of inGroup) {
      lines.push(`- [${r.title}](${canonicalFor(r)}): ${r.description}`);
    }
    lines.push('');
  }

  lines.push(
    '## Contact',
    '',
    `- Email: ${ORGANIZATION.email}`,
    `- Office: ${ORGANIZATION.street}, ${ORGANIZATION.locality}, ${ORGANIZATION.region} ${ORGANIZATION.postalCode}`,
    '',
  );

  await writeFile(join(DIST, 'llms.txt'), lines.join('\n'), 'utf8');
  console.log('  llms.txt');
}

const shell = await readFile(join(DIST, 'index.html'), 'utf8');
if (!shell.includes('</head>')) {
  console.error('seo-build: dist/index.html has no </head>; did vite build run?');
  process.exit(1);
}

console.log('==> SEO build');
await buildPages(shell);
await buildSitemap();
await buildRobots();
await buildLlms();
await buildBuildInfo();
console.log('==> SEO build complete');
