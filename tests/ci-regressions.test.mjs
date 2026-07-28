import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { mkdtemp, mkdir, rm, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import test, { afterEach } from 'node:test';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const workflowPath = fileURLToPath(new URL('../.github/workflows/ci.yml', import.meta.url));
const changedQualityPath = fileURLToPath(new URL('../scripts/lint-changed.mjs', import.meta.url));
const typeCheckPath = fileURLToPath(new URL('../scripts/typecheck-all.mjs', import.meta.url));
const fixtureDirectories = [];

function git(cwd, ...args) {
  return execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
}

async function createTypeScriptFixture(files) {
  const directory = await mkdtemp(path.join(repoRoot, '.ci-contract-'));
  fixtureDirectories.push(directory);
  await mkdir(path.join(directory, 'src'));
  await writeFile(
    path.join(directory, 'eslint.config.mjs'),
    "import tseslint from 'typescript-eslint';\nexport default [{ files: ['**/*.{js,mjs,cjs}'] }, { files: ['**/*.{ts,tsx,mts,cts}'], languageOptions: { parser: tseslint.parser } }];\n",
    'utf8',
  );
  await writeFile(
    path.join(directory, 'tsconfig.json'),
    JSON.stringify({
      compilerOptions: {
        allowJs: true,
        checkJs: true,
        module: 'ESNext',
        moduleResolution: 'Bundler',
        noEmit: true,
        strict: true,
        target: 'ES2022',
        types: [],
      },
      include: ['src'],
    }),
    'utf8',
  );
  await Promise.all(Object.entries(files).map(async ([file, content]) => {
    const filePath = path.join(directory, file);
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, content, 'utf8');
  }));
  git(directory, 'init', '--initial-branch=main');
  git(directory, 'config', 'core.autocrlf', 'false');
  git(directory, 'config', 'user.email', 'ci@example.com');
  git(directory, 'config', 'user.name', 'CI Contract');
  git(directory, 'add', '.');
  git(directory, 'commit', '-m', 'baseline');
  return directory;
}

function runChangedQuality(cwd) {
  return spawnSync(process.execPath, [changedQualityPath, '--base', 'HEAD'], {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, GITHUB_ACTIONS: '' },
  });
}

function runTypeCheck(cwd, ...args) {
  return spawnSync(process.execPath, [typeCheckPath, '--cwd', cwd, ...args], {
    cwd,
    encoding: 'utf8',
  });
}

function runCanonicalVerify(typeCheckCwd) {
  const npmCli = process.env.npm_execpath
    ?? (process.platform === 'win32'
      ? path.join(path.dirname(process.execPath), 'node_modules', 'npm', 'bin', 'npm-cli.js')
      : null);
  const command = npmCli ? process.execPath : 'npm';
  const args = npmCli ? [npmCli, 'run', 'verify'] : ['run', 'verify'];
  return spawnSync(command, args, {
    cwd: repoRoot,
    encoding: 'utf8',
    env: { ...process.env, TYPECHECK_CWD: typeCheckCwd },
  });
}

afterEach(async () => {
  await Promise.all(fixtureDirectories.splice(0).map((directory) => (
    rm(directory, { recursive: true, force: true })
  )));
});

test('three main pushes cannot replace pending source verification coverage', async () => {
  const workflow = parse(await readFile(workflowPath, 'utf8'));

  assert.equal(
    workflow.concurrency,
    undefined,
    'workflow-level concurrency can replace the only pending main-push verification run',
  );
  assert.equal(
    workflow.jobs.verify.concurrency,
    undefined,
    'job-level concurrency can replace the only pending main-push verification job',
  );
});

test('a regenerated baseline cannot ratchet beyond the changed range base', async () => {
  const cleanSource = 'export const value: string = "ok";\n';
  const diagnosticSource = 'export const value = 1 as string;\n';
  const directory = await createTypeScriptFixture({ 'src/value.ts': cleanSource });
  const sourcePath = path.join(directory, 'src', 'value.ts');
  const baselinePath = path.join(directory, 'typecheck-baseline.json');

  await writeFile(sourcePath, diagnosticSource, 'utf8');
  const diagnosticBootstrap = runTypeCheck(directory, '--write-baseline');
  assert.equal(diagnosticBootstrap.status, 0, diagnosticBootstrap.stderr);
  const grownBaseline = await readFile(baselinePath, 'utf8');

  await writeFile(sourcePath, cleanSource, 'utf8');
  const cleanBootstrap = runTypeCheck(directory, '--write-baseline');
  assert.equal(cleanBootstrap.status, 0, cleanBootstrap.stderr);
  git(directory, 'add', 'typecheck-baseline.json');
  git(directory, 'commit', '-m', 'establish typecheck baseline');

  await writeFile(sourcePath, diagnosticSource, 'utf8');
  await writeFile(baselinePath, grownBaseline, 'utf8');

  const changedResult = runChangedQuality(directory);
  assert.notEqual(changedResult.status, 0, `${changedResult.stdout}\n${changedResult.stderr}`);
  assert.match(`${changedResult.stdout}${changedResult.stderr}`, /baseline growth/i);

  const writeResult = runTypeCheck(directory, '--write-baseline');
  assert.notEqual(writeResult.status, 0, `${writeResult.stdout}\n${writeResult.stderr}`);
  assert.match(`${writeResult.stdout}${writeResult.stderr}`, /baseline growth/i);
});

test('a fixed diagnostic requires baseline shrinkage before the same error can return', async () => {
  const cleanSource = 'export const value: string = "ok";\n';
  const diagnosticSource = 'export const value = 1 as string;\n';
  const directory = await createTypeScriptFixture({ 'src/value.ts': diagnosticSource });
  const sourcePath = path.join(directory, 'src', 'value.ts');

  const bootstrap = runTypeCheck(directory, '--write-baseline');
  assert.equal(bootstrap.status, 0, bootstrap.stderr);
  git(directory, 'add', 'typecheck-baseline.json');
  git(directory, 'commit', '-m', 'establish diagnostic baseline');

  await writeFile(sourcePath, cleanSource, 'utf8');
  const staleResult = runTypeCheck(directory);
  assert.notEqual(staleResult.status, 0, `${staleResult.stdout}\n${staleResult.stderr}`);
  assert.match(`${staleResult.stdout}${staleResult.stderr}`, /stale baseline/i);

  const shrinkResult = runTypeCheck(directory, '--write-baseline');
  assert.equal(shrinkResult.status, 0, `${shrinkResult.stdout}\n${shrinkResult.stderr}`);
  git(directory, 'add', 'src/value.ts', 'typecheck-baseline.json');
  git(directory, 'commit', '-m', 'fix diagnostic and shrink baseline');

  await writeFile(sourcePath, diagnosticSource, 'utf8');
  const reintroducedResult = runChangedQuality(directory);
  assert.notEqual(
    reintroducedResult.status,
    0,
    `${reintroducedResult.stdout}\n${reintroducedResult.stderr}`,
  );
  assert.match(`${reintroducedResult.stdout}${reintroducedResult.stderr}`, /baseline growth/i);
});

test('an added ambient contract cannot remain in the reconstructed baseline', async () => {
  const directory = await createTypeScriptFixture({
    'src/a-contract.d.ts': 'declare function feature(value: string): string;\n',
    'src/consumer.ts': 'export const result: string = feature("value");\n',
    'src/touched.js': 'export const touched = 1;\n',
  });
  await writeFile(
    path.join(directory, 'src', 'z-added.d.ts'),
    'declare function feature(value: string): number;\n',
    'utf8',
  );
  await writeFile(path.join(directory, 'src', 'touched.js'), 'export const touched = 2;\n', 'utf8');

  const result = runChangedQuality(directory);

  assert.notEqual(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(`${result.stdout}${result.stderr}`, /consumer\.ts/);
});

test('removing a declare-global contract fails on its unchanged consumer', async () => {
  const directory = await createTypeScriptFixture({
    'src/consumer.ts': 'export const formatted = featureCount.toFixed(2);\n',
    'src/contract.ts': 'export {};\ndeclare global { const featureCount: number; }\n',
  });
  await writeFile(path.join(directory, 'src', 'contract.ts'), 'export {};\n', 'utf8');

  const result = runChangedQuality(directory);

  assert.notEqual(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(`${result.stdout}${result.stderr}`, /consumer\.ts[\s\S]*Cannot find name 'featureCount'/);
});

test('project-owned declaration dependents participate in affected programs', async () => {
  const directory = await createTypeScriptFixture({
    'src/consumer.d.ts': "import type { Feature } from './shared';\nexport declare const current: Feature;\n",
    'src/shared.ts': 'export interface Feature { enabled: boolean }\n',
  });
  await writeFile(
    path.join(directory, 'src', 'shared.ts'),
    'export interface Replacement { enabled: boolean }\n',
    'utf8',
  );

  const result = runChangedQuality(directory);

  assert.notEqual(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(`${result.stdout}${result.stderr}`, /consumer\.d\.ts[\s\S]*has no exported member 'Feature'/);
});

test('deleted and old renamed source paths cannot bypass the quality gate', async () => {
  const directory = await createTypeScriptFixture({
    'src/consumer.ts': "import { value } from './shared';\nexport const result = value;\n",
    'src/shared.ts': 'export const value = 1;\n',
  });
  await unlink(path.join(directory, 'src', 'shared.ts'));

  const result = runChangedQuality(directory);

  assert.notEqual(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(`${result.stdout}${result.stderr}`, /D src\/shared\.ts[\s\S]*consumer\.ts[\s\S]*Cannot find module/);

  const renamedDirectory = await createTypeScriptFixture({
    'src/consumer.ts': "import { value } from './shared';\nexport const result = value;\n",
    'src/shared.ts': 'export const value = 1;\n',
  });
  git(renamedDirectory, 'mv', 'src/shared.ts', 'src/renamed.ts');

  const renamedResult = runChangedQuality(renamedDirectory);

  assert.notEqual(renamedResult.status, 0, `${renamedResult.stdout}\n${renamedResult.stderr}`);
  const renamedOutput = `${renamedResult.stdout}${renamedResult.stderr}`;
  assert.match(renamedOutput, /R100:old src\/shared\.ts/);
  assert.match(renamedOutput, /R100:new src\/renamed\.ts/);
  assert.match(renamedOutput, /consumer\.ts[\s\S]*Cannot find module/);
});

test('a malformed test TypeScript config fails changed and canonical verification', async () => {
  const directory = await createTypeScriptFixture({
    'src/value.ts': 'export const value = 1;\n',
    'tests/consumer.ts': "import { value } from '../src/value';\nexport const result = value;\n",
    'tsconfig.test.json': JSON.stringify({
      extends: './tsconfig.json',
      include: ['tests'],
    }),
  });
  await writeFile(path.join(directory, 'tsconfig.test.json'), '{ "compilerOptions": ', 'utf8');

  const changedResult = runChangedQuality(directory);
  assert.notEqual(changedResult.status, 0, `${changedResult.stdout}\n${changedResult.stderr}`);
  assert.match(`${changedResult.stdout}${changedResult.stderr}`, /tsconfig\.test\.json/);

  const verifyResult = runCanonicalVerify(directory);
  assert.notEqual(verifyResult.status, 0, `${verifyResult.stdout}\n${verifyResult.stderr}`);
  assert.match(`${verifyResult.stdout}${verifyResult.stderr}`, /tsconfig\.test\.json/);
});
