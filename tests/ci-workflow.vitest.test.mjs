// @vitest-environment node

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import viteConfig from '../vite.config.js';

const workflowPath = fileURLToPath(new URL('../.github/workflows/ci.yml', import.meta.url));
const packagePath = fileURLToPath(new URL('../package.json', import.meta.url));

describe('CI baseline', () => {
  it('keeps compiler-backed contracts within a bounded timeout', () => {
    expect(viteConfig.test?.testTimeout).toBeGreaterThanOrEqual(15_000);
    expect(viteConfig.test?.testTimeout).toBeLessThanOrEqual(30_000);
  });

  it('runs changed quality plus complete repository verification locally', async () => {
    const packageJson = JSON.parse(await readFile(packagePath, 'utf8'));

    expect(packageJson.scripts['quality:changed']).toBe('node scripts/lint-changed.mjs');
    expect(packageJson.scripts.typecheck).toBe('node scripts/typecheck-all.mjs');
    expect(packageJson.scripts.verify).toBe(
      'npm run lint && npm run typecheck && npm run test:run && npm run build',
    );
    expect(packageJson.scripts.ci).toBe('npm run quality:changed && npm run verify');
  });

  it('uses fail-closed Node 24 verification for pull requests and every main push', async () => {
    const workflow = parse(await readFile(workflowPath, 'utf8'));
    const job = workflow.jobs.verify;

    expect(workflow.name).toBe('CI');
    expect(workflow.on.pull_request.branches).toEqual(['main']);
    expect(workflow.on.push.branches).toEqual(['main']);
    expect(workflow.permissions).toEqual({ contents: 'read' });
    expect(workflow.concurrency).toBeUndefined();
    expect(job.name).toBe('Verify');
    expect(job['timeout-minutes']).toBeGreaterThan(0);

    const steps = job.steps;
    const checkout = steps.find((step) => step.uses?.startsWith('actions/checkout@'));
    const setupNode = steps.find((step) => step.uses?.startsWith('actions/setup-node@'));
    const install = steps.find((step) => step.run === 'npm ci');
    const changedQuality = steps.find((step) => step.run === 'npm run quality:changed');
    const verify = steps.find((step) => step.run === 'npm run verify');

    expect(checkout?.with).toMatchObject({
      'fetch-depth': 0,
      'persist-credentials': false,
    });
    expect(setupNode?.with).toMatchObject({ cache: 'npm', 'node-version': '24' });
    expect(install?.['timeout-minutes']).toBeGreaterThan(0);
    expect(changedQuality?.['timeout-minutes']).toBeGreaterThan(0);
    expect(verify?.['timeout-minutes']).toBeGreaterThan(0);
  });
});
