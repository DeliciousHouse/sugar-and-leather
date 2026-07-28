import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ESLint } from 'eslint';
import { typeCheckAllConfigs } from './typecheck-all.mjs';

const SOURCE_FILE = /\.(?:[cm]?[jt]s|[jt]sx)$/i;
const TYPESCRIPT_CONFIG = /(?:^|\/)(?:tsconfig(?:\..+)?|typecheck-baseline)\.json$/i;
const ZERO_SHA = /^0+$/;

/**
 * @typedef {{ path: string, status: string }} QualityChange
 * @typedef {{ args?: string[], cwd?: string, env?: NodeJS.ProcessEnv }} QualityContext
 */

/** @param {string[]} args @param {string} cwd */
function git(args, cwd) {
  return execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
}

/** @param {string} ref @param {string} cwd */
function assertCommit(ref, cwd) {
  try {
    git(['rev-parse', '--verify', `${ref}^{commit}`], cwd);
  } catch {
    throw new Error(`Cannot resolve quality comparison ref: ${ref}`);
  }
}

/** @param {string[]} args */
function parseBaseArgument(args) {
  if (args.length === 0) return undefined;
  if (args.length === 2 && args[0] === '--base' && args[1]) return args[1];
  throw new Error('Usage: npm run quality:changed -- [--base <git-ref>]');
}

/** @param {QualityContext} [context] */
export function resolveDiffRange({ args = [], env = process.env, cwd = process.cwd() } = {}) {
  const explicitBase = parseBaseArgument(args);
  if (explicitBase) {
    assertCommit(explicitBase, cwd);
    return `${explicitBase}...HEAD`;
  }

  if (env.GITHUB_ACTIONS === 'true' && env.GITHUB_EVENT_NAME === 'pull_request') {
    if (!env.GITHUB_BASE_REF) {
      throw new Error('GITHUB_BASE_REF is required for pull_request quality checks');
    }
    const base = `origin/${env.GITHUB_BASE_REF}`;
    assertCommit(base, cwd);
    return `${base}...HEAD`;
  }

  if (env.GITHUB_ACTIONS === 'true' && env.GITHUB_EVENT_NAME === 'push') {
    if (!env.GITHUB_EVENT_BEFORE || ZERO_SHA.test(env.GITHUB_EVENT_BEFORE)) {
      throw new Error('A non-zero GITHUB_EVENT_BEFORE is required for push quality checks');
    }
    if (!env.GITHUB_SHA) {
      throw new Error('GITHUB_SHA is required for push quality checks');
    }
    assertCommit(env.GITHUB_EVENT_BEFORE, cwd);
    assertCommit(env.GITHUB_SHA, cwd);
    return `${env.GITHUB_EVENT_BEFORE}..${env.GITHUB_SHA}`;
  }

  if (env.GITHUB_ACTIONS !== 'true') {
    assertCommit('origin/main', cwd);
    return 'origin/main...HEAD';
  }

  throw new Error(`Unsupported quality context: ${env.GITHUB_EVENT_NAME || '(missing)'}`);
}

/** @param {string} output @returns {QualityChange[]} */
function parseNameStatus(output) {
  const tokens = output.split('\0').filter(Boolean);
  const changes = [];
  for (let index = 0; index < tokens.length;) {
    const status = tokens[index];
    index += 1;
    if (!status) break;
    const firstPath = tokens[index];
    index += 1;
    if (!firstPath) break;
    if (/^[RC]/.test(status)) {
      const secondPath = tokens[index];
      index += 1;
      if (!secondPath) break;
      changes.push({ path: firstPath, status: `${status}:old` });
      changes.push({ path: secondPath, status: `${status}:new` });
    } else {
      changes.push({ path: firstPath, status });
    }
  }
  return changes;
}

/** @param {string[]} args @param {string} cwd */
function diffChanges(args, cwd) {
  return parseNameStatus(execFileSync('git', args, { cwd, encoding: 'utf8' }));
}

/** @param {string} range */
function comparisonBase(range) {
  const separator = range.includes('...') ? '...' : '..';
  return range.slice(0, range.indexOf(separator));
}

/**
 * @param {string} range
 * @param {{ cwd?: string, includeWorkingTree?: boolean }} [options]
 * @returns {QualityChange[]}
 */
export function changedQualityPaths(
  range,
  { cwd = process.cwd(), includeWorkingTree = false } = {},
) {
  const changes = diffChanges(
    ['diff', '--name-status', '-z', '--diff-filter=ACDMRTUXB', range, '--'],
    cwd,
  );

  if (includeWorkingTree) {
    changes.push(
      ...diffChanges(['diff', '--name-status', '-z', '--diff-filter=ACDMRTUXB', '--cached', '--'], cwd),
      ...diffChanges(['diff', '--name-status', '-z', '--diff-filter=ACDMRTUXB', '--'], cwd),
    );
    const untracked = execFileSync(
      'git',
      ['ls-files', '--others', '--exclude-standard', '-z', '--'],
      { cwd, encoding: 'utf8' },
    );
    for (const file of untracked.split('\0').filter(Boolean)) {
      changes.push({ path: file, status: '?' });
    }
  }

  const uniqueChanges = new Map();
  for (const change of changes) {
    uniqueChanges.set(`${change.status}\0${change.path}`, change);
  }
  return [...uniqueChanges.values()].sort((left, right) => left.path.localeCompare(right.path));
}

/** @param {string[]} files @param {{ cwd?: string }} [options] */
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

/** @param {QualityContext} [context] */
export async function main({ args = process.argv.slice(2), env = process.env, cwd = process.cwd() } = {}) {
  const range = resolveDiffRange({ args, env, cwd });
  const changes = changedQualityPaths(range, {
    cwd,
    includeWorkingTree: env.GITHUB_ACTIONS !== 'true',
  });
  const relevantChanges = changes.filter(
    ({ path: file }) => SOURCE_FILE.test(file) || TYPESCRIPT_CONFIG.test(file),
  );

  if (relevantChanges.length === 0) {
    console.log(`No changed JavaScript, TypeScript, or TypeScript config files in ${range}.`);
    return;
  }

  console.log(`Checking ${relevantChanges.length} quality-impacting path(s) from ${range}:`);
  relevantChanges.forEach(({ path: file, status }) => console.log(`  ${status} ${file}`));

  const lintTargets = [...new Set(relevantChanges
    .filter(({ path: file, status }) => (
      SOURCE_FILE.test(file)
      && !status.startsWith('D')
      && !status.endsWith(':old')
      && existsSync(path.join(cwd, file))
    ))
    .map(({ path: file }) => file))];
  await lintFiles(lintTargets, { cwd });
  const configs = typeCheckAllConfigs({ cwd, baseRef: comparisonBase(range) });
  console.log(`Type-checked ${configs.length} TypeScript configuration(s): ${configs.join(', ')}`);
}

const isDirectRun = process.argv[1]
  && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isDirectRun) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
