// @vitest-environment node

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import viteConfig from '../vite.config.js';

const workflowPath = fileURLToPath(new URL('../.github/workflows/ci.yml', import.meta.url));
const packagePath = fileURLToPath(new URL('../package.json', import.meta.url));

describe('CI workflow', () => {
  it('uses a realistic bounded timeout for compiler-backed quality tests', () => {
    const testTimeout = viteConfig.test?.testTimeout;
    expect(testTimeout).toBeGreaterThanOrEqual(15_000);
    expect(testTimeout).toBeLessThanOrEqual(30_000);
  });

  it('keeps the changed-file gate and full verification in local scripts', async () => {
    const packageJson = JSON.parse(await readFile(packagePath, 'utf8'));

    expect(packageJson.scripts['quality:changed']).toBe('node scripts/lint-changed.mjs');
    expect(packageJson.scripts.ci).toBe('npm run quality:changed && npm run verify');
  });

  it('runs pull request and push verification on main with stable bounded setup', async () => {
    const workflow = parse(await readFile(workflowPath, 'utf8'));
    const job = workflow.jobs.verify;

    expect(workflow.name).toBe('CI');
    expect(workflow.on.pull_request.branches).toEqual(['main']);
    expect(workflow.on.push.branches).toEqual(['main']);
    expect(workflow.concurrency.group).toContain('github.workflow');
    expect(workflow.concurrency['cancel-in-progress']).toBe(true);
    expect(job.name).toBe('Verify');
    expect(job['timeout-minutes']).toBeGreaterThan(0);

    /** @type {Array<{ uses?: string, run?: string, with?: Record<string, unknown>, 'timeout-minutes'?: number }>} */
    const steps = job.steps;
    const checkout = steps.find((step) => step.uses?.startsWith('actions/checkout@'));
    const setupNode = steps.find((step) => step.uses?.startsWith('actions/setup-node@'));
    const install = steps.find((step) => step.run === 'npm ci');
    const changedQuality = steps.find((step) => step.run === 'npm run quality:changed');
    const verify = steps.find((step) => step.run === 'npm run verify');

    expect(checkout?.with?.['fetch-depth']).toBe(0);
    expect(setupNode?.with).toMatchObject({ cache: 'npm', 'node-version': '24' });
    expect(install?.['timeout-minutes']).toBeGreaterThan(0);
    expect(changedQuality?.['timeout-minutes']).toBeGreaterThan(0);
    expect(verify?.['timeout-minutes']).toBeGreaterThan(0);
  });
});
