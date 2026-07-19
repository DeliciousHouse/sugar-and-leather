import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ESLint } from 'eslint';

const SOURCE_FILE = /\.(?:[cm]?[jt]s|[jt]sx)$/i;
const ZERO_SHA = /^0+$/;

/**
 * @typedef {object} LintContext
 * @property {string[]} [args]
 * @property {string} [cwd]
 * @property {NodeJS.ProcessEnv} [env]
 */

/**
 * @param {string[]} args
 * @param {string} cwd
 */
function git(args, cwd) {
  return execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
}

/**
 * @param {string} ref
 * @param {string} cwd
 */
function assertCommit(ref, cwd) {
  try {
    git(['rev-parse', '--verify', `${ref}^{commit}`], cwd);
  } catch {
    throw new Error(`Cannot resolve lint comparison ref: ${ref}`);
  }
}

/**
 * @param {string[]} args
 * @returns {string | undefined}
 */
function parseBaseArgument(args) {
  if (args.length === 0) return undefined;
  if (args.length === 2 && args[0] === '--base' && args[1]) return args[1];
  throw new Error('Usage: npm run lint:changed -- [--base <git-ref>]');
}

/** @param {LintContext} [context] */
export function resolveDiffRange({ args = [], env = process.env, cwd = process.cwd() } = {}) {
  const explicitBase = parseBaseArgument(args);
  if (explicitBase) {
    assertCommit(explicitBase, cwd);
    return `${explicitBase}...HEAD`;
  }

  if (env.GITHUB_ACTIONS === 'true' && env.GITHUB_EVENT_NAME === 'pull_request') {
    if (!env.GITHUB_BASE_REF) {
      throw new Error('GITHUB_BASE_REF is required for pull_request linting');
    }
    const base = `origin/${env.GITHUB_BASE_REF}`;
    assertCommit(base, cwd);
    return `${base}...HEAD`;
  }

  if (env.GITHUB_ACTIONS === 'true' && env.GITHUB_EVENT_NAME === 'push') {
    if (!env.GITHUB_EVENT_BEFORE || ZERO_SHA.test(env.GITHUB_EVENT_BEFORE)) {
      throw new Error('A non-zero GITHUB_EVENT_BEFORE is required for push linting');
    }
    if (!env.GITHUB_SHA) {
      throw new Error('GITHUB_SHA is required for push linting');
    }
    assertCommit(env.GITHUB_EVENT_BEFORE, cwd);
    assertCommit(env.GITHUB_SHA, cwd);
    return `${env.GITHUB_EVENT_BEFORE}..${env.GITHUB_SHA}`;
  }

  if (env.GITHUB_ACTIONS !== 'true') {
    assertCommit('origin/main', cwd);
    return 'origin/main...HEAD';
  }

  throw new Error(`Unsupported lint context: ${env.GITHUB_EVENT_NAME || '(missing)'}`);
}

/**
 * @param {string} range
 * @param {{ cwd?: string }} [options]
 */
export function changedSourceFiles(range, { cwd = process.cwd() } = {}) {
  const output = execFileSync(
    'git',
    ['diff', '--name-only', '--diff-filter=ACMR', '-z', range, '--'],
    { cwd, encoding: 'utf8' },
  );

  return output
    .split('\0')
    .filter(Boolean)
    .filter((file) => SOURCE_FILE.test(file));
}

/**
 * @param {string[]} files
 * @param {{ cwd?: string }} [options]
 * @returns {Promise<import('eslint').ESLint.LintResult[]>}
 */
export async function lintFiles(files, { cwd = process.cwd() } = {}) {
  if (files.length === 0) return [];

  const eslint = new ESLint({ cwd });
  const results = await eslint.lintFiles(files);
  const issueCount = results.reduce(
    (total, result) => total + result.errorCount + result.warningCount,
    0,
  );

  if (issueCount > 0) {
    const formatter = await eslint.loadFormatter('stylish');
    throw new Error(`ESLint reported issues in changed source files:\n${formatter.format(results)}`);
  }

  return results;
}

/** @param {LintContext} [context] */
export async function main({ args = process.argv.slice(2), env = process.env, cwd = process.cwd() } = {}) {
  const range = resolveDiffRange({ args, env, cwd });
  const files = changedSourceFiles(range, { cwd });

  if (files.length === 0) {
    console.log(`No changed JavaScript or TypeScript files in ${range}.`);
    return;
  }

  console.log(`Linting ${files.length} changed source file(s) from ${range}:`);
  files.forEach((file) => console.log(`  ${file}`));
  await lintFiles(files, { cwd });
}

const isDirectRun = process.argv[1]
  && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isDirectRun) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
