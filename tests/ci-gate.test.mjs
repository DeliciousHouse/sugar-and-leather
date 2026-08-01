import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { ESLint } from 'eslint';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');
const severity = (rule) => (Array.isArray(rule) ? rule[0] : rule);

const trackedPrograms = execFileSync(
  'git',
  ['ls-files', '-z', '*.js', '*.jsx', '*.mjs', '*.cjs'],
  { encoding: 'utf8' },
)
  .split('\0')
  .filter(Boolean);

test('every tracked JavaScript program has substantive fail-closed lint rules', async () => {
  const eslint = new ESLint();
  assert.ok(trackedPrograms.length > 0);

  for (const path of trackedPrograms) {
    const config = await eslint.calculateConfigForFile(path);
    assert.ok(config, `${path} has no ESLint configuration`);
    assert.equal(severity(config.rules?.['no-undef']), 2, `${path} does not fail on undefined identifiers`);
    assert.equal(severity(config.rules?.['no-unused-vars']), 2, `${path} does not fail on unused variables`);
  }
});

test('tracked programs receive runtime-appropriate globals', async () => {
  const eslint = new ESLint();
  const browserPrograms = ['js/site.js', 'src/App.jsx', 'tweaks-panel.jsx'];
  const nodePrograms = [
    'eslint.config.js',
    'scripts/seo-build.mjs',
    'server/feedback/index.mjs',
    'tests/ci-gate.test.mjs',
    'vite.config.js',
  ];

  for (const path of browserPrograms) {
    const config = await eslint.calculateConfigForFile(path);
    assert.ok(
      Object.hasOwn(config.languageOptions.globals, 'document'),
      `${path} is missing browser globals`,
    );
    assert.ok(
      !Object.hasOwn(config.languageOptions.globals, 'process'),
      `${path} incorrectly permits Node globals`,
    );
  }

  for (const path of nodePrograms) {
    const config = await eslint.calculateConfigForFile(path);
    assert.ok(
      Object.hasOwn(config.languageOptions.globals, 'process'),
      `${path} is missing Node globals`,
    );
  }

  const tweaksConfig = await eslint.calculateConfigForFile('tweaks-panel.jsx');
  assert.equal(severity(tweaksConfig.rules['react-hooks/rules-of-hooks']), 2);
  assert.equal(tweaksConfig.rules['react-refresh/only-export-components'], undefined);
});

test('workflow gives PRs a stable cancelable group and every push a unique noncancelable group', async () => {
  const workflow = await read('.github/workflows/ci.yml');
  assert.match(
    workflow,
    /group: ci-\$\{\{ github\.event_name == 'pull_request' && format\('pr-\{0\}', github\.event\.pull_request\.number\) \|\| format\('push-\{0\}', github\.run_id\) \}\}/,
  );
  assert.match(workflow, /cancel-in-progress: \$\{\{ github\.event_name == 'pull_request' \}\}/);
});

test('workflow and production build use the same exact Node 22 patch and immutable current actions', async () => {
  const [workflow, dockerfile] = await Promise.all([
    read('.github/workflows/ci.yml'),
    read('Dockerfile'),
  ]);

  assert.match(workflow, /runs-on: ubuntu-24\.04/);
  assert.match(workflow, /actions\/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1\s+# v7\.0\.1/);
  assert.match(workflow, /actions\/setup-node@820762786026740c76f36085b0efc47a31fe5020\s+# v7\.0\.0/);
  assert.match(workflow, /node-version: '22\.23\.2'/);
  assert.match(dockerfile, /FROM node:22\.23\.2-alpine AS build/);
});
