// @vitest-environment node

import { readFile } from 'node:fs/promises';
import { matchesGlob } from 'node:path/posix';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';

const packagePath = fileURLToPath(new URL('../package.json', import.meta.url));
const dockerIgnorePath = fileURLToPath(new URL('../.dockerignore', import.meta.url));
const workflowPath = fileURLToPath(new URL('../.github/workflows/ci.yml', import.meta.url));
const deployWorkflowPath = fileURLToPath(new URL('../.github/workflows/deploy.yml', import.meta.url));
const typecheckConfigPath = fileURLToPath(new URL('../tsconfig.json', import.meta.url));

const read = (path) => readFile(path, 'utf8');

function assertNoBypass(job) {
  for (const target of [job, ...(job.steps ?? [])]) {
    for (const key of ['continue-on-error', 'if']) {
      if (Object.hasOwn(target, key)) throw new Error(`forbidden CI bypass: ${key}`);
    }
  }
}

describe('repository verification contract', () => {
  it('keeps CI workflows in Docker context and excludes machine-local agent worktrees', async () => {
    const rules = (await read(dockerIgnorePath))
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'));
    const isIgnored = (candidate) => candidate
      .split('/')
      .map((_, index, parts) => parts.slice(0, index + 1).join('/'))
      .some((path) => rules.some((rule) => matchesGlob(path, rule)));

    expect({
      ciWorkflowIncluded: !isIgnored('.github/workflows/ci.yml'),
      deployWorkflowIncluded: !isIgnored('.github/workflows/deploy.yml'),
      agentWorktreeIncluded: !isIgnored('.claude/worktrees/task/checkout'),
    }).toEqual({
      ciWorkflowIncluded: true,
      deployWorkflowIncluded: true,
      agentWorktreeIncluded: false,
    });
  });

  it('keeps lint, type, test, and production-build gates in the local source of truth', async () => {
    const packageJson = JSON.parse(await read(packagePath));

    expect(packageJson.engines).toEqual({ node: '>=24 <25' });
    expect(packageJson.scripts).toMatchObject({
      lint: 'eslint . --max-warnings=0',
      test: 'vitest run',
      typecheck: 'node scripts/typecheck-baseline.mjs',
      verify: 'npm run lint && npm run typecheck && npm test && npm run build',
    });

    const typecheckConfig = JSON.parse(await read(typecheckConfigPath));
    expect(typecheckConfig.compilerOptions).toMatchObject({
      allowJs: true,
      checkJs: true,
      strict: true,
    });
    expect(typecheckConfig.include).toContain('src');
  });

  it('runs the full fail-closed gate on Linux for pull requests and main pushes', async () => {
    const workflow = parse(await read(workflowPath));
    const verify = workflow.jobs.verify;
    const checkout = verify.steps.find((step) => step.uses?.startsWith('actions/checkout@'));

    expect(workflow.on).toEqual({
      pull_request: { branches: ['main'] },
      push: { branches: ['main'] },
    });
    expect(workflow.permissions).toEqual({ contents: 'read' });
    expect(verify['runs-on']).toBe('ubuntu-latest');
    expect(verify['timeout-minutes']).toBeGreaterThan(0);
    expect(() => assertNoBypass(verify)).not.toThrow();
    expect(checkout).toMatchObject({
      with: {
        'persist-credentials': false,
        ref: "${{ github.event_name == 'pull_request' && github.event.pull_request.head.sha || github.sha }}",
      },
    });
    expect(verify.steps).toEqual(expect.arrayContaining([
      expect.objectContaining({
        uses: expect.stringMatching(/^actions\/setup-node@/),
        with: expect.objectContaining({ 'node-version-file': '.nvmrc' }),
      }),
    ]));
    expect(verify.steps.map((step) => step.run).filter(Boolean)).toEqual([
      'npm ci',
      'npm run verify',
      'bash deploy/test-deploy.sh',
    ]);
  });

  it.each([
    ['job continue expression', { 'continue-on-error': '${{ true }}', steps: [] }],
    ['job false condition', { if: false, steps: [] }],
    ['step continue expression', { steps: [{ 'continue-on-error': '${{ true }}' }] }],
    ['step false condition', { steps: [{ if: false }] }],
  ])('rejects the %s bypass', (_label, job) => {
    expect(() => assertNoBypass(job)).toThrow(/forbidden CI bypass/);
  });

  it('does not let concurrent main pushes replace one another before verification', async () => {
    const workflow = parse(await read(workflowPath));

    expect(workflow.concurrency.group).toContain('github.run_id');
    expect(workflow.concurrency['cancel-in-progress']).toContain("github.event_name == 'pull_request'");
  });

  it('runs bounded cleanup only after the public deployment identity gate', async () => {
    const workflow = parse(await read(deployWorkflowPath));
    const steps = workflow.jobs.deploy.steps;
    const verifyIndex = steps.findIndex((step) => step.name === 'Verify production is serving this commit');
    const cleanupIndex = steps.findIndex((step) => step.name === 'Clean up old deployment artifacts');

    expect(verifyIndex).toBeGreaterThan(-1);
    expect(steps[verifyIndex].run).toContain('build.json');
    expect(steps[verifyIndex].run).toContain('EXPECTED_BUNDLE');
    expect(steps[verifyIndex].run).toContain('robots.txt');
    expect(cleanupIndex).toBeGreaterThan(verifyIndex);
    expect(steps[cleanupIndex].run).toContain('"sl-deploy-cleanup"');
  });
});
