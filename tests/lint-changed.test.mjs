// @vitest-environment node

import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, rm, unlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';
import * as changedQuality from '../scripts/lint-changed.mjs';
import {
  changedSourceFiles,
  lintFiles,
  resolveDiffRange,
} from '../scripts/lint-changed.mjs';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const lintScript = fileURLToPath(new URL('../scripts/lint-changed.mjs', import.meta.url));
/** @type {string[]} */
const fixtureDirectories = [];

/**
 * @param {string} cwd
 * @param {...string} args
 */
function git(cwd, ...args) {
  return execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
}

afterEach(async () => {
  await Promise.all(fixtureDirectories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })));
});

describe('diff-scoped lint guard', () => {
  it('rejects Node-only globals in changed browser source', async () => {
    const fixtureDirectory = await mkdtemp(path.join(repoRoot, 'src', 'lint-guard-'));
    fixtureDirectories.push(fixtureDirectory);
    const fixturePath = path.join(fixtureDirectory, 'node-global.jsx');
    await writeFile(
      fixturePath,
      'export const encoded = Buffer.from("browser-only");\n',
      'utf8',
    );

    const fixture = path.relative(repoRoot, fixturePath).split(path.sep).join('/');

    await expect(lintFiles([fixture], { cwd: repoRoot })).rejects.toThrow(
      "'Buffer' is not defined",
    );
  });

  it('lints changed TypeScript instead of treating it as ignored', async () => {
    const fixtureDirectory = await mkdtemp(path.join(repoRoot, 'tests', 'lint-guard-'));
    fixtureDirectories.push(fixtureDirectory);
    const fixturePath = path.join(fixtureDirectory, 'supported.tsx');
    await writeFile(
      fixturePath,
      'export function Supported() { return <div>supported</div>; }\n',
      'utf8',
    );

    const fixture = path.relative(repoRoot, fixturePath).split(path.sep).join('/');

    await expect(lintFiles([fixture], { cwd: repoRoot })).resolves.toHaveLength(1);
  });

  it('fails the changed quality gate on an application type error', async () => {
    const fixtureDirectory = await mkdtemp(path.join(repoRoot, 'src', 'type-guard-'));
    fixtureDirectories.push(fixtureDirectory);
    const fixturePath = path.join(fixtureDirectory, 'changed-app.js');
    await writeFile(
      fixturePath,
      '/** @type {number} */\nexport const count = "not-a-number";\n',
      'utf8',
    );

    const fixture = path.relative(repoRoot, fixturePath).split(path.sep).join('/');

    expect(changedQuality.qualityFiles).toBeTypeOf('function');
    await expect(changedQuality.qualityFiles([fixture], { cwd: repoRoot })).rejects.toThrow(
      /TypeScript reported issues in changed source files:[\s\S]*changed-app\.js[\s\S]*not assignable to type 'number'/,
    );
  });

  it('fails the changed quality gate on a test type error', async () => {
    const fixtureDirectory = await mkdtemp(path.join(repoRoot, 'tests', 'type-guard-'));
    fixtureDirectories.push(fixtureDirectory);
    const fixturePath = path.join(fixtureDirectory, 'changed-test.ts');
    await writeFile(
      fixturePath,
      'export const attempts: number = "not-a-number";\n',
      'utf8',
    );

    const fixture = path.relative(repoRoot, fixturePath).split(path.sep).join('/');

    await expect(changedQuality.qualityFiles([fixture], { cwd: repoRoot })).rejects.toThrow(
      /TypeScript reported issues in changed source files:[\s\S]*changed-test\.ts[\s\S]*not assignable to type 'number'/,
    );
  });

  it('fails closed when a changed source file contains invalid syntax', async () => {
    const fixtureDirectory = await mkdtemp(path.join(repoRoot, 'tests', 'lint-guard-'));
    fixtureDirectories.push(fixtureDirectory);
    const fixturePath = path.join(fixtureDirectory, 'invalid.jsx');
    await writeFile(fixturePath, 'export default function Broken( {\n', 'utf8');

    const fixture = path.relative(repoRoot, fixturePath).split(path.sep).join('/');

    /** @type {Error | undefined} */
    let lintError;
    try {
      await lintFiles([fixture], { cwd: repoRoot });
    } catch (error) {
      if (error instanceof Error) lintError = error;
    }

    expect(lintError).toBeInstanceOf(Error);
    if (!lintError) throw new Error('Expected lintFiles to reject');
    expect(lintError.message).toContain('invalid.jsx');
    expect(lintError.message).toContain('Parsing error');
  });

  it('fails closed when a changed source file is ignored by ESLint configuration', async () => {
    await expect(lintFiles(['js/site.js'], { cwd: repoRoot })).rejects.toThrow(
      'File ignored because of a matching ignore pattern',
    );
  });

  it('selects only added or modified JavaScript and TypeScript files', async () => {
    const fixtureDirectory = await mkdtemp(path.join(os.tmpdir(), 'lint-changed-'));
    fixtureDirectories.push(fixtureDirectory);
    git(fixtureDirectory, 'init', '--initial-branch=main');
    git(fixtureDirectory, 'config', 'core.autocrlf', 'false');
    git(fixtureDirectory, 'config', 'user.email', 'ci@example.com');
    git(fixtureDirectory, 'config', 'user.name', 'CI Test');
    await mkdir(path.join(fixtureDirectory, 'src'));
    await writeFile(path.join(fixtureDirectory, 'src', 'kept.js'), 'export const value = 1;\n');
    await writeFile(path.join(fixtureDirectory, 'src', 'deleted.ts'), 'export const old = true;\n');
    await writeFile(path.join(fixtureDirectory, 'notes.md'), 'baseline\n');
    git(fixtureDirectory, 'add', '.');
    git(fixtureDirectory, 'commit', '-m', 'baseline');

    await writeFile(path.join(fixtureDirectory, 'src', 'kept.js'), 'export const value = 2;\n');
    await writeFile(path.join(fixtureDirectory, 'src', 'New.tsx'), 'export function New() { return null; }\n');
    await writeFile(path.join(fixtureDirectory, 'notes.md'), 'documentation only\n');
    await unlink(path.join(fixtureDirectory, 'src', 'deleted.ts'));
    git(fixtureDirectory, 'add', '--all');
    git(fixtureDirectory, 'commit', '-m', 'change files');

    expect(changedSourceFiles('HEAD^..HEAD', { cwd: fixtureDirectory })).toEqual([
      'src/New.tsx',
      'src/kept.js',
    ]);
  });

  it('uses the pull request base branch as the comparison ref', () => {
    expect(resolveDiffRange({
      cwd: repoRoot,
      env: {
        GITHUB_ACTIONS: 'true',
        GITHUB_BASE_REF: 'main',
        GITHUB_EVENT_NAME: 'pull_request',
      },
    })).toBe('origin/main...HEAD');
  });

  it('uses the exact before and after commits for a push', () => {
    const before = git(repoRoot, 'rev-parse', 'HEAD^');
    const after = git(repoRoot, 'rev-parse', 'HEAD');

    expect(resolveDiffRange({
      cwd: repoRoot,
      env: {
        GITHUB_ACTIONS: 'true',
        GITHUB_EVENT_BEFORE: before,
        GITHUB_EVENT_NAME: 'push',
        GITHUB_SHA: after,
      },
    })).toBe(`${before}..${after}`);
  });

  it('fails closed when a push has no usable before commit', () => {
    expect(() => resolveDiffRange({
      cwd: repoRoot,
      env: {
        GITHUB_ACTIONS: 'true',
        GITHUB_EVENT_BEFORE: '0000000000000000000000000000000000000000',
        GITHUB_EVENT_NAME: 'push',
        GITHUB_SHA: git(repoRoot, 'rev-parse', 'HEAD'),
      },
    })).toThrow('A non-zero GITHUB_EVENT_BEFORE is required for push linting');
  });

  it('accepts an explicit base ref for local verification', () => {
    expect(resolveDiffRange({
      args: ['--base', 'HEAD^'],
      cwd: repoRoot,
      env: {},
    })).toBe('HEAD^...HEAD');
  });

  it('defaults local verification to origin main', () => {
    expect(resolveDiffRange({
      cwd: repoRoot,
      env: {},
    })).toBe('origin/main...HEAD');
  });

  it('runs the diff-scoped gate from the command line', () => {
    const output = execFileSync(process.execPath, [lintScript, '--base', 'HEAD'], {
      cwd: repoRoot,
      encoding: 'utf8',
    });

    expect(output).toContain('No changed JavaScript or TypeScript files in HEAD...HEAD.');
  });
});
