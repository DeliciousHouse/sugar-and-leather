import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';

// The application is JavaScript with pre-existing strict-check diagnostics. Check the
// complete app and build tooling anyway, then compare the exact sorted diagnostic set.
// Any added, removed, moved, or duplicated diagnostic fails CI. Refresh with
// `node scripts/typecheck-baseline.mjs --write-baseline` only after reviewing that delta.
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BASELINE_PATH = resolve(ROOT, 'config/typecheck-baseline.json');
const CONFIGS = ['tsconfig.json', 'tsconfig.node.json'];
const SCHEMA_VERSION = 1;

/** @typedef {{ schemaVersion: number, configs: string[], diagnostics: string[] }} Baseline */

/** @param {string} path */
const normalizePath = (path) => path.replaceAll('\\', '/');

/** @param {string[]} values */
function countValues(values) {
  const counts = new Map();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return counts;
}

/**
 * @param {string[]} expected
 * @param {string[]} actual
 */
export function diffDiagnostics(expected, actual) {
  const expectedCounts = countValues(expected);
  const added = [];

  for (const diagnostic of actual) {
    const remaining = expectedCounts.get(diagnostic) ?? 0;
    if (remaining > 0) {
      expectedCounts.set(diagnostic, remaining - 1);
    } else {
      added.push(diagnostic);
    }
  }

  const removed = [];
  for (const [diagnostic, count] of expectedCounts) {
    for (let index = 0; index < count; index += 1) removed.push(diagnostic);
  }

  return {
    added: added.sort(),
    removed: removed.sort(),
  };
}

/**
 * @param {string} configName
 * @param {ts.Diagnostic} diagnostic
 */
function serializeDiagnostic(configName, diagnostic) {
  const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, ' ').replace(/\s+/g, ' ');
  if (!diagnostic.file || diagnostic.start === undefined) {
    return `${configName}: TS${diagnostic.code}: ${message}`;
  }

  const position = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
  const path = normalizePath(relative(ROOT, diagnostic.file.fileName));
  return `${configName}: ${path}(${position.line + 1},${position.character + 1}): TS${diagnostic.code}: ${message}`;
}

/** @param {string} configName */
function readConfig(configName) {
  const configPath = resolve(ROOT, configName);
  const result = ts.readConfigFile(configPath, ts.sys.readFile);
  if (result.error) throw new Error(serializeDiagnostic(configName, result.error));

  const parsed = ts.parseJsonConfigFileContent(result.config, ts.sys, ROOT, undefined, configPath);
  if (parsed.errors.length) {
    throw new Error(parsed.errors.map((diagnostic) => serializeDiagnostic(configName, diagnostic)).join('\n'));
  }
  return parsed;
}

function collectDiagnostics() {
  const diagnostics = [];
  const sourceFiles = new Set();

  for (const configName of CONFIGS) {
    const parsed = readConfig(configName);
    for (const fileName of parsed.fileNames) sourceFiles.add(normalizePath(relative(ROOT, fileName)));

    const program = ts.createProgram(parsed.fileNames, parsed.options);
    for (const diagnostic of ts.getPreEmitDiagnostics(program)) {
      diagnostics.push(serializeDiagnostic(configName, diagnostic));
    }
  }

  return {
    diagnostics: diagnostics.sort(),
    sourceFileCount: sourceFiles.size,
  };
}

/**
 * @param {string} label
 * @param {string[]} diagnostics
 */
function reportChanges(label, diagnostics) {
  if (!diagnostics.length) return;
  console.error(`\n${label} (${diagnostics.length}):`);
  for (const diagnostic of diagnostics.slice(0, 40)) console.error(`  ${diagnostic}`);
  if (diagnostics.length > 40) console.error(`  ... ${diagnostics.length - 40} more`);
}

/** @param {string[]} diagnostics */
async function writeBaseline(diagnostics) {
  await mkdir(dirname(BASELINE_PATH), { recursive: true });
  await writeFile(BASELINE_PATH, `${JSON.stringify({
    schemaVersion: SCHEMA_VERSION,
    configs: CONFIGS,
    diagnostics,
  }, null, 2)}\n`, 'utf8');
  console.log(`typecheck: wrote ${diagnostics.length} diagnostics to config/typecheck-baseline.json`);
}

async function readBaseline() {
  /** @type {Baseline} */
  let parsed;
  try {
    parsed = JSON.parse(await readFile(BASELINE_PATH, 'utf8'));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Cannot read config/typecheck-baseline.json: ${message}`);
  }

  if (
    parsed.schemaVersion !== SCHEMA_VERSION
    || JSON.stringify(parsed.configs) !== JSON.stringify(CONFIGS)
    || !Array.isArray(parsed.diagnostics)
    || parsed.diagnostics.some((diagnostic) => typeof diagnostic !== 'string')
  ) {
    throw new Error('config/typecheck-baseline.json has an unsupported or invalid schema');
  }
  return parsed.diagnostics;
}

/** @param {string[]} args */
export async function main(args = process.argv.slice(2)) {
  const { diagnostics, sourceFileCount } = collectDiagnostics();
  if (args.includes('--write-baseline')) {
    await writeBaseline(diagnostics);
    return;
  }

  const expected = await readBaseline();
  const changes = diffDiagnostics(expected, diagnostics);
  if (changes.added.length || changes.removed.length) {
    console.error('typecheck: full-program diagnostics changed; review the delta before refreshing the baseline');
    reportChanges('Added diagnostics', changes.added);
    reportChanges('Removed diagnostics', changes.removed);
    process.exitCode = 1;
    return;
  }

  console.log(`typecheck: OK — ${sourceFileCount} source files checked; ${diagnostics.length} known diagnostics unchanged`);
}

const entryPoint = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : '';
if (entryPoint === import.meta.url) {
  main().catch((error) => {
    console.error(`typecheck: ${error.message}`);
    process.exitCode = 1;
  });
}
