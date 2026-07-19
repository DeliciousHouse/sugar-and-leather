// @vitest-environment node

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';

const workflowPath = fileURLToPath(new URL('../.github/workflows/ci.yml', import.meta.url));

describe('CI workflow', () => {
  it('runs the repository CI command with deterministic, bounded setup', async () => {
    const workflow = parse(await readFile(workflowPath, 'utf8'));
    const job = workflow.jobs.verify;

    expect(workflow.on.pull_request.branches).toEqual(['main']);
    expect(workflow.on.push.branches).toEqual(['main']);
    expect(workflow.concurrency['cancel-in-progress']).toBe(true);
    expect(job['timeout-minutes']).toBeGreaterThan(0);

    const checkout = job.steps.find((step) => step.uses?.startsWith('actions/checkout@'));
    const setupNode = job.steps.find((step) => step.uses?.startsWith('actions/setup-node@'));
    const install = job.steps.find((step) => step.run === 'npm ci');
    const verify = job.steps.find((step) => step.run === 'npm run ci');

    expect(checkout.with['fetch-depth']).toBe(0);
    expect(setupNode.with).toMatchObject({ cache: 'npm', 'node-version': '24' });
    expect(install['timeout-minutes']).toBeGreaterThan(0);
    expect(verify['timeout-minutes']).toBeGreaterThan(0);
  });
});
