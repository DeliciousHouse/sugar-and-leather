import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const BASELINE_FILE = 'typecheck-baseline.json';

/** @param {string} file */
function canonicalPath(file) {
  const absolutePath = path.resolve(file);
  return ts.sys.useCaseSensitiveFileNames ? absolutePath : absolutePath.toLowerCase();
}

/** @param {readonly ts.Diagnostic[]} diagnostics @param {string} cwd */
function formatDiagnostics(diagnostics, cwd) {
  return ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCanonicalFileName: canonicalPath,
    getCurrentDirectory: () => cwd,
    getNewLine: () => ts.sys.newLine,
  });
}

/** @param {ts.Diagnostic} diagnostic @param {string} cwd */
function diagnosticFingerprint(diagnostic, cwd) {
  const file = diagnostic.file
    ? path.relative(cwd, diagnostic.file.fileName).replaceAll('\\', '/')
    : '<global>';
  const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
  return `${file}|TS${diagnostic.code}|${message}`;
}

/** @param {readonly ts.Diagnostic[]} diagnostics @param {string} cwd */
function diagnosticEntries(diagnostics, cwd) {
  const counts = new Map();
  for (const diagnostic of diagnostics) {
    const fingerprint = diagnosticFingerprint(diagnostic, cwd);
    counts.set(fingerprint, (counts.get(fingerprint) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([fingerprint, count]) => ({ fingerprint, count }));
}

/**
 * @typedef {{ fingerprint: string, count: number }} BaselineDiagnostic
 * @typedef {{ version: 1, diagnostics: Record<string, BaselineDiagnostic[]> }} TypecheckBaseline
 */

/** @param {unknown} value @returns {value is TypecheckBaseline} */
function isTypecheckBaseline(value) {
  if (!value || typeof value !== 'object') return false;
  if (!('version' in value) || value.version !== 1) return false;
  if (
    !('diagnostics' in value)
    || !value.diagnostics
    || typeof value.diagnostics !== 'object'
    || Array.isArray(value.diagnostics)
  ) {
    return false;
  }
  return Object.values(value.diagnostics).every((entries) => (
    Array.isArray(entries)
    && entries.every((entry) => (
      entry
      && typeof entry === 'object'
      && 'fingerprint' in entry
      && typeof entry.fingerprint === 'string'
      && 'count' in entry
      && Number.isInteger(entry.count)
      && entry.count > 0
    ))
  ));
}

/** @param {string} cwd */
function readBaseline(cwd) {
  const baselinePath = path.join(cwd, BASELINE_FILE);
  if (!existsSync(baselinePath)) return null;

  /** @type {unknown} */
  let parsed;
  try {
    parsed = JSON.parse(readFileSync(baselinePath, 'utf8'));
  } catch (error) {
    throw new Error(`Cannot read ${BASELINE_FILE}: ${error instanceof Error ? error.message : String(error)}`);
  }

  if (!isTypecheckBaseline(parsed)) {
    throw new Error(`${BASELINE_FILE} must contain a version 1 diagnostics baseline.`);
  }
  return parsed;
}

export function typeScriptConfigNames(cwd = process.cwd()) {
  return readdirSync(cwd, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /^tsconfig(?:\..+)?\.json$/i.test(entry.name))
    .map((entry) => entry.name)
    .sort();
}

export function typeCheckAllConfigs({ cwd = process.cwd(), writeBaseline = false } = {}) {
  const configNames = typeScriptConfigNames(cwd);
  if (configNames.length === 0) {
    throw new Error('No TypeScript configurations found.');
  }

  /** @type {Record<string, BaselineDiagnostic[]>} */
  const currentBaseline = {};
  /** @type {Record<string, readonly ts.Diagnostic[]>} */
  const diagnosticsByConfig = {};

  for (const configName of configNames) {
    const configPath = path.join(cwd, configName);
    const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
    if (configFile.error) {
      throw new Error(`Cannot read ${configName}:\n${formatDiagnostics([configFile.error], cwd)}`);
    }

    const parsedConfig = ts.parseJsonConfigFileContent(
      configFile.config,
      ts.sys,
      cwd,
      { noEmit: true },
      configPath,
    );
    if (parsedConfig.errors.length > 0) {
      throw new Error(`Invalid ${configName}:\n${formatDiagnostics(parsedConfig.errors, cwd)}`);
    }

    const program = ts.createProgram({
      rootNames: parsedConfig.fileNames,
      options: parsedConfig.options,
      projectReferences: parsedConfig.projectReferences,
    });
    const diagnostics = ts.getPreEmitDiagnostics(program);
    diagnosticsByConfig[configName] = diagnostics;
    currentBaseline[configName] = diagnosticEntries(diagnostics, cwd);
  }

  if (writeBaseline) {
    const baselinePath = path.join(cwd, BASELINE_FILE);
    const baseline = { version: 1, diagnostics: currentBaseline };
    writeFileSync(baselinePath, `${JSON.stringify(baseline, null, 2)}\n`, 'utf8');
    return configNames;
  }

  const baseline = readBaseline(cwd);
  if (baseline) {
    const missingConfigs = Object.keys(baseline.diagnostics)
      .filter((configName) => !configNames.includes(configName));
    if (missingConfigs.length > 0) {
      throw new Error(`TypeScript configuration(s) missing: ${missingConfigs.join(', ')}`);
    }
  }

  for (const configName of configNames) {
    const allowed = new Map(
      (baseline?.diagnostics[configName] ?? [])
        .map(({ fingerprint, count }) => [fingerprint, count]),
    );
    const unexpected = diagnosticsByConfig[configName].filter((diagnostic) => {
      const fingerprint = diagnosticFingerprint(diagnostic, cwd);
      const remaining = allowed.get(fingerprint) ?? 0;
      if (remaining <= 0) return true;
      allowed.set(fingerprint, remaining - 1);
      return false;
    });
    if (unexpected.length > 0) {
      throw new Error(
        `TypeScript reported issues in ${configName}:\n${formatDiagnostics(unexpected, cwd)}`,
      );
    }
  }

  return configNames;
}

/** @param {string[]} args */
function parseArguments(args) {
  let cwd = path.resolve(process.env.TYPECHECK_CWD ?? process.cwd());
  let writeBaseline = false;
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === '--cwd' && args[index + 1]) {
      cwd = path.resolve(args[index + 1]);
      index += 1;
    } else if (args[index] === '--write-baseline') {
      writeBaseline = true;
    } else {
      throw new Error(
        'Usage: node scripts/typecheck-all.mjs [--cwd <directory>] [--write-baseline]',
      );
    }
  }
  return { cwd, writeBaseline };
}

const isDirectRun = process.argv[1]
  && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isDirectRun) {
  try {
    const { cwd, writeBaseline } = parseArguments(process.argv.slice(2));
    const configs = typeCheckAllConfigs({ cwd, writeBaseline });
    console.log(
      writeBaseline
        ? `Wrote ${BASELINE_FILE} for ${configs.length} TypeScript configuration(s).`
        : `Type-checked ${configs.length} TypeScript configuration(s): ${configs.join(', ')}`,
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
