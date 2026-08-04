#!/usr/bin/env node
//
// Fails the build when the SEO table and the app disagree.
//
// The hand-maintained sitemap this replaced listed URLs nobody had verified were still
// routable. That failure mode is invisible in production: ProductPage, PodPage and
// EcosystemPage all `<Navigate to="/" replace/>` on an unknown slug, so a dead sitemap
// entry returns HTTP 200 and silently redirects home — a textbook soft 404, and exactly
// the kind of thing that only surfaces months later in Search Console.
//
// So: every route the app can render must have an entry in src/data/seo.js, and every
// entry must correspond to something the app can render. Adding a page without SEO copy
// is now a build error rather than a slow SEO leak.
//
// The content modules are parsed rather than imported on purpose — they pull in
// src/lib/asset.js, which reads Vite's `import.meta.env` and cannot be evaluated by plain
// Node. src/data/seo.js is deliberately dependency-free so it CAN be.

import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { ORGANIZATION, ROUTES, canonicalFor, titleFor } from '../src/data/seo.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
/** @param {string} rel */
const read = (rel) => readFile(join(ROOT, rel), 'utf8');

/** @type {string[]} */
const errors = [];
/** @param {string} msg */
const fail = (msg) => errors.push(msg);

/**
 * Pull a `export const NAME = ['a', 'b'];` string-array literal out of a source file.
 * @param {string} src
 * @param {string} name
 * @returns {string[] | null}
 */
function parseSlugArray(src, name) {
  const m = src.match(new RegExp(`export const ${name}\\s*=\\s*\\[([\\s\\S]*?)\\]`));
  if (!m) return null;
  return [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]);
}

const [appSrc, pagesSrc, podSrc, ecoSrc, inquirySrc] = await Promise.all([
  read('src/App.jsx'),
  read('src/data/pagesContent.js'),
  read('src/data/podContent.js'),
  read('src/data/ecosystemContent.js'),
  read('src/data/inquiryContent.js'),
]);

const productSlugs = parseSlugArray(pagesSrc, 'PRODUCT_SLUGS');
const podSlugs = parseSlugArray(podSrc, 'POD_SLUGS');
const ecosystemSlugs = parseSlugArray(ecoSrc, 'ECOSYSTEM_SLUGS');

for (const [name, val] of [
  ['PRODUCT_SLUGS', productSlugs],
  ['POD_SLUGS', podSlugs],
  ['ECOSYSTEM_SLUGS', ecosystemSlugs],
])
  if (!val?.length) fail(`could not parse ${name} — seo-check needs updating`);

if (!productSlugs?.length || !podSlugs?.length || !ecosystemSlugs?.length) {
  for (const e of errors) console.error(`seo-check: ${e}`);
  process.exit(1);
}

// --- what the app can actually render ----------------------------------------------
// Static <Route path="x" element={<Page/>}/> entries, skipping the legacy redirects
// (element is <Navigate/> or a Redirect* helper) and the dynamic `:param` routes, which
// we expand from the slug arrays below.
/** @type {string[]} */
const staticPaths = [];
for (const m of appSrc.matchAll(/<Route\s+path="([^"]+)"\s+element=\{([^}]*)\}/g)) {
  const [, path, element] = m;
  if (path.includes(':')) continue;
  if (/Navigate|Redirect/.test(element)) continue;
  staticPaths.push(`/${path}`);
}
if (/<Route\s+index\b/.test(appSrc)) staticPaths.push('/');

// The `:slug` catch-all renders EcosystemPage for any ECOSYSTEM_SLUGS entry that a more
// specific static route hasn't already claimed.
const ecosystemCatchAll = ecosystemSlugs
  .map((s) => `/${s}`)
  .filter((p) => !staticPaths.includes(p));

const renderable = new Set([
  ...staticPaths,
  ...ecosystemCatchAll,
  ...productSlugs.map((s) => `/practices/${s}`),
  ...podSlugs.map((s) => `/strategic-cxo-team/${s}`),
]);

// --- cross-check -------------------------------------------------------------------
const declared = new Set(ROUTES.map((r) => r.path));

for (const path of renderable)
  if (!declared.has(path))
    fail(`route "${path}" is renderable but has no entry in src/data/seo.js — add title + description`);

for (const path of declared)
  if (!renderable.has(path))
    fail(`src/data/seo.js declares "${path}" but no route renders it — it would soft-404 to "/"`);

// --- quality gates on the copy itself ----------------------------------------------
const seenTitle = new Map();
const seenDesc = new Map();
for (const r of ROUTES) {
  const title = titleFor(r);
  const len = r.description.length;

  if (len < 80) fail(`${r.path}: description is ${len} chars — too thin, aim for 120-160`);
  if (len > 170) fail(`${r.path}: description is ${len} chars — will be truncated in results`);

  if (seenTitle.has(title))
    fail(`duplicate <title> "${title}" on ${seenTitle.get(title)} and ${r.path}`);
  seenTitle.set(title, r.path);

  if (seenDesc.has(r.description))
    fail(`duplicate description on ${seenDesc.get(r.description)} and ${r.path}`);
  seenDesc.set(r.description, r.path);

  if (!canonicalFor(r).startsWith('https://')) fail(`${r.path}: canonical is not https`);
}

// --- address parity ------------------------------------------------------------------
// ORGANIZATION is duplicated from inquiryContent.js (see the comment there). A wrong
// address on the live site is exactly the class of bug that started this whole cleanup,
// so assert the copies still agree rather than trusting a comment to be read.
for (const [label, value] of [
  ['street', ORGANIZATION.street],
  ['locality', ORGANIZATION.locality],
])
  if (!inquirySrc.includes(value))
    fail(
      `ORGANIZATION.${label} ("${value}") is not present in src/data/inquiryContent.js — ` +
        `the JSON-LD address and the contact page have drifted apart`,
    );

if (errors.length) {
  console.error(`\nseo-check: ${errors.length} problem(s)\n`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(
  `seo-check: OK — ${ROUTES.length} routes, ${ROUTES.filter((r) => r.index !== false).length} indexable, ` +
    `all titles and descriptions unique`,
);
