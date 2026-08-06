import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readRepositoryFile = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('the site image builds with Node 24', async () => {
  const dockerfile = await readRepositoryFile('Dockerfile');

  assert.match(dockerfile, /^FROM node:24-alpine AS build\r?$/m);
});

test('the feedback service runs with Node 24', async () => {
  const dockerfile = await readRepositoryFile('server/feedback/Dockerfile');

  assert.match(dockerfile, /^FROM node:24-alpine\r?$/m);
});

test('.nvmrc selects Node 24', async () => {
  const nvmrc = await readRepositoryFile('.nvmrc').catch((error) => {
    if (error.code === 'ENOENT') return null;
    throw error;
  });

  assert.equal(nvmrc?.trim(), '24');
});

test('package manifests require the Node 24 release line', async () => {
  const packageJson = JSON.parse(await readRepositoryFile('package.json'));
  const packageLock = JSON.parse(await readRepositoryFile('package-lock.json'));

  assert.equal(packageJson.engines?.node, '24.x');
  assert.equal(packageLock.packages[''].engines?.node, '24.x');
});

test('deployment verification builds with Node 24', async () => {
  const workflow = await readRepositoryFile('.github/workflows/deploy.yml');

  assert.match(workflow, /^\s+node-version: '24'\r?$/m);
});
