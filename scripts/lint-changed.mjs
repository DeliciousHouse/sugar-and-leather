import { execFileSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ESLint } from 'eslint';
import ts from 'typescript';

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
 * @param {{ cwd?: string, includeWorkingTree?: boolean }} [options]
 */
export function changedSourceFiles(
  range,
  { cwd = process.cwd(), includeWorkingTree = false } = {},
) {
  const commands = [
    ['diff', '--name-only', '--diff-filter=ACMR', '-z', range, '--'],
  ];
  if (includeWorkingTree) {
    commands.push(
      ['diff', '--name-only', '--diff-filter=ACMR', '-z', '--cached', '--'],
      ['diff', '--name-only', '--diff-filter=ACMR', '-z', '--'],
      ['ls-files', '--others', '--exclude-standard', '-z', '--'],
    );
  }

  const files = new Set();
  for (const args of commands) {
    const output = execFileSync('git', args, { cwd, encoding: 'utf8' });
    output
      .split('\0')
      .filter(Boolean)
      .filter((file) => SOURCE_FILE.test(file))
      .forEach((file) => files.add(file));
  }

  return [...files].sort();
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

/**
 * @param {string} file
 */
function canonicalPath(file) {
  const absolutePath = path.resolve(file);
  return ts.sys.useCaseSensitiveFileNames ? absolutePath : absolutePath.toLowerCase();
}

/**
 * @param {readonly ts.Diagnostic[]} diagnostics
 * @param {string} cwd
 */
function formatTypeScriptDiagnostics(diagnostics, cwd) {
  return ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCanonicalFileName: canonicalPath,
    getCurrentDirectory: () => cwd,
    getNewLine: () => ts.sys.newLine,
  });
}

/**
 * @param {ts.Diagnostic} diagnostic
 */
function diagnosticKey(diagnostic) {
  const fileName = diagnostic.file ? canonicalPath(diagnostic.file.fileName) : '';
  const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
  return [fileName, diagnostic.start ?? '', diagnostic.length ?? '', diagnostic.code, message].join('\0');
}

/**
 * @param {ts.ParsedCommandLine} parsedConfig
 * @param {Map<string, string>} [sourceOverrides]
 */
function createTypeScriptProgram(parsedConfig, sourceOverrides = new Map()) {
  if (sourceOverrides.size === 0) {
    return ts.createProgram({
      rootNames: parsedConfig.fileNames,
      options: parsedConfig.options,
      projectReferences: parsedConfig.projectReferences,
    });
  }

  const host = ts.createCompilerHost(parsedConfig.options);
  const defaultFileExists = host.fileExists.bind(host);
  const defaultGetSourceFile = host.getSourceFile.bind(host);
  const defaultReadFile = host.readFile.bind(host);

  host.fileExists = (fileName) => sourceOverrides.has(canonicalPath(fileName))
    || defaultFileExists(fileName);
  host.readFile = (fileName) => sourceOverrides.get(canonicalPath(fileName))
    ?? defaultReadFile(fileName);
  host.getSourceFile = (fileName, languageVersion, onError, shouldCreateNewSourceFile) => {
    const sourceText = sourceOverrides.get(canonicalPath(fileName));
    if (sourceText === undefined) {
      return defaultGetSourceFile(fileName, languageVersion, onError, shouldCreateNewSourceFile);
    }
    return ts.createSourceFile(fileName, sourceText, languageVersion, true);
  };

  return ts.createProgram({
    host,
    rootNames: parsedConfig.fileNames,
    options: parsedConfig.options,
    projectReferences: parsedConfig.projectReferences,
  });
}

/**
 * @param {ts.SourceFile} sourceFile
 */
function containsAmbientContract(sourceFile) {
  if (sourceFile.isDeclarationFile) return true;

  let containsGlobalAugmentation = false;
  /** @param {ts.Node} node */
  const visit = (node) => {
    if (ts.isModuleDeclaration(node) && (node.flags & ts.NodeFlags.GlobalAugmentation) !== 0) {
      containsGlobalAugmentation = true;
      return;
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return containsGlobalAugmentation;
}

/**
 * @param {ts.Program} program
 * @param {string[]} changedFiles
 * @param {string} cwd
 */
function diagnosticsForChangedPrograms(program, changedFiles, cwd) {
  /** @type {Map<string, Set<string>>} */
  const dependentsByFile = new Map();

  for (const sourceFile of program.getSourceFiles()) {
    const relativePath = path.relative(cwd, sourceFile.fileName);
    if (sourceFile.isDeclarationFile || relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
      continue;
    }

    const dependent = canonicalPath(sourceFile.fileName);
    const imports = ts.preProcessFile(sourceFile.text, true, true).importedFiles;
    for (const importedFile of imports) {
      const resolvedModule = ts.resolveModuleName(
        importedFile.fileName,
        sourceFile.fileName,
        program.getCompilerOptions(),
        ts.sys,
      ).resolvedModule;
      if (!resolvedModule || resolvedModule.isExternalLibraryImport) continue;

      const dependency = canonicalPath(resolvedModule.resolvedFileName);
      const dependents = dependentsByFile.get(dependency) ?? new Set();
      dependents.add(dependent);
      dependentsByFile.set(dependency, dependents);
    }
  }

  const affectedFiles = new Set(
    changedFiles.map((file) => canonicalPath(path.resolve(cwd, file))),
  );
  const ambientContractChanged = changedFiles.some((file) => {
    const sourceFile = program.getSourceFile(path.resolve(cwd, file));
    return sourceFile ? containsAmbientContract(sourceFile) : false;
  });
  if (ambientContractChanged) {
    for (const sourceFile of program.getSourceFiles()) {
      const relativePath = path.relative(cwd, sourceFile.fileName);
      if (!relativePath.startsWith('..') && !path.isAbsolute(relativePath)) {
        affectedFiles.add(canonicalPath(sourceFile.fileName));
      }
    }
  }
  const pendingFiles = [...affectedFiles];
  while (pendingFiles.length > 0) {
    const dependency = pendingFiles.pop();
    if (!dependency) continue;
    for (const dependent of dependentsByFile.get(dependency) ?? []) {
      if (affectedFiles.has(dependent)) continue;
      affectedFiles.add(dependent);
      pendingFiles.push(dependent);
    }
  }

  return ts.getPreEmitDiagnostics(program).filter(
    (diagnostic) => !diagnostic.file
      || affectedFiles.has(canonicalPath(diagnostic.file.fileName)),
  );
}

/**
 * @param {string[]} changedFiles
 * @param {string} baselineRef
 * @param {string} cwd
 */
function baselineSourceOverrides(changedFiles, baselineRef, cwd) {
  /** @type {Map<string, string>} */
  const sourceOverrides = new Map();

  for (const file of changedFiles) {
    const absolutePath = path.resolve(cwd, file);
    const repositoryPath = path.relative(cwd, absolutePath).split(path.sep).join('/');
    try {
      const sourceText = execFileSync(
        'git',
        ['show', `${baselineRef}:${repositoryPath}`],
        { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
      );
      sourceOverrides.set(canonicalPath(absolutePath), sourceText);
    } catch {
      // Added files have no baseline contents. Their own diagnostics still fail below.
    }
  }

  return sourceOverrides;
}

/**
 * @param {string} range
 */
function comparisonBase(range) {
  const separator = range.includes('...') ? '...' : '..';
  return range.slice(0, range.indexOf(separator));
}

/**
 * @param {string} configName
 * @param {string} cwd
 */
function parseTypeScriptConfig(configName, cwd) {
  const configPath = path.join(cwd, configName);
  const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
  if (configFile.error) {
    throw new Error(
      `Cannot read ${configName}:\n${formatTypeScriptDiagnostics([configFile.error], cwd)}`,
    );
  }

  const parsedConfig = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    cwd,
    { noEmit: true },
    configPath,
  );
  if (parsedConfig.errors.length > 0) {
    throw new Error(
      `Invalid ${configName}:\n${formatTypeScriptDiagnostics(parsedConfig.errors, cwd)}`,
    );
  }
  return parsedConfig;
}

/**
 * @param {string} cwd
 */
function typeScriptConfigNames(cwd) {
  return readdirSync(cwd, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /^tsconfig(?:\..+)?\.json$/i.test(entry.name))
    .map((entry) => entry.name)
    .sort();
}

/**
 * @param {string[]} files
 * @param {{ baselineRef?: string, cwd?: string }} [options]
 * @returns {Promise<readonly ts.Diagnostic[]>}
 */
export async function typeCheckFiles(files, { baselineRef, cwd = process.cwd() } = {}) {
  if (files.length === 0) return [];

  const diagnostics = [];
  const representedFiles = new Set();
  for (const configName of typeScriptConfigNames(cwd)) {
    const parsedConfig = parseTypeScriptConfig(configName, cwd);
    const program = createTypeScriptProgram(parsedConfig);
    const configFiles = files.filter((file) => {
      const sourceFile = program.getSourceFile(path.resolve(cwd, file));
      if (!sourceFile) return false;
      representedFiles.add(canonicalPath(sourceFile.fileName));
      return true;
    });
    if (configFiles.length === 0) continue;

    let changedProgramDiagnostics = diagnosticsForChangedPrograms(program, configFiles, cwd);

    if (baselineRef) {
      const sourceOverrides = baselineSourceOverrides(configFiles, baselineRef, cwd);
      if (sourceOverrides.size > 0) {
        const baselineProgram = createTypeScriptProgram(parsedConfig, sourceOverrides);
        const baselineDiagnostics = new Set(
          ts.getPreEmitDiagnostics(baselineProgram).map(diagnosticKey),
        );
        const changedFileNames = new Set(
          configFiles.map((file) => canonicalPath(path.resolve(cwd, file))),
        );
        changedProgramDiagnostics = changedProgramDiagnostics.filter(
          (diagnostic) => !diagnostic.file
            || changedFileNames.has(canonicalPath(diagnostic.file.fileName))
            || !baselineDiagnostics.has(diagnosticKey(diagnostic)),
        );
      }
    }

    diagnostics.push(...changedProgramDiagnostics);
  }

  const missingFiles = files.filter(
    (file) => !representedFiles.has(canonicalPath(path.resolve(cwd, file))),
  );
  if (missingFiles.length > 0) {
    throw new Error(
      `Changed source files are not covered by a TypeScript config:\n${missingFiles.join('\n')}`,
    );
  }

  const uniqueDiagnostics = [...new Map(
    diagnostics.map((diagnostic) => [diagnosticKey(diagnostic), diagnostic]),
  ).values()];
  if (uniqueDiagnostics.length > 0) {
    throw new Error(
      `TypeScript reported issues in changed source files:\n${formatTypeScriptDiagnostics(uniqueDiagnostics, cwd)}`,
    );
  }

  return uniqueDiagnostics;
}

/**
 * @param {string[]} files
 * @param {{ baselineRef?: string, cwd?: string }} [options]
 */
export async function qualityFiles(files, options = {}) {
  const lintResults = await lintFiles(files, options);
  await typeCheckFiles(files, options);
  return lintResults;
}

/** @param {LintContext} [context] */
export async function main({ args = process.argv.slice(2), env = process.env, cwd = process.cwd() } = {}) {
  const range = resolveDiffRange({ args, env, cwd });
  const files = changedSourceFiles(range, {
    cwd,
    includeWorkingTree: env.GITHUB_ACTIONS !== 'true',
  });

  if (files.length === 0) {
    console.log(`No changed JavaScript or TypeScript files in ${range}.`);
    return;
  }

  console.log(`Checking ${files.length} changed source file(s) from ${range}:`);
  files.forEach((file) => console.log(`  ${file}`));
  await qualityFiles(files, { baselineRef: comparisonBase(range), cwd });
}

const isDirectRun = process.argv[1]
  && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isDirectRun) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}