// Flat config (ESLint 9). Deliberately small.
//
// Three earlier attempts at this gate (PRs #9, #14, #15) were all closed unmerged, and
// every blocking finding was a fail-open path in the gate's OWN machinery rather than in
// the code it was supposed to check: diff-scoping that skipped cross-config dependents, a
// TypeScript baseline that could be deleted and regrown to launder a new error, tsconfigs
// that could be renamed to bypass checking.
//
// Both of those mechanisms exist to retrofit a gate onto a large codebase that already has
// violations. This repo is 80 JSX files and has zero TypeScript. So neither is used here:
// every run lints the entire repo, and there is no baseline to tamper with. That is both
// simpler and strictly stronger than a diff-scoped check, and it deletes the whole class
// of bypass the previous attempts kept reopening.
//
// If this repo ever grows past the point where a full lint is fast enough, the answer is
// to make lint faster, not to reintroduce diff-scoping.

import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  { ignores: ['dist/**', 'node_modules/**'] },

  // Browser application code. No Node globals: src/ is bundled for the browser, so a
  // stray `process` or `Buffer` here is a runtime crash, not a type error.
  {
    files: ['src/**/*.{js,jsx}'],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      // Without this, base no-unused-vars cannot see identifiers used only as JSX tags,
      // so `{ as: Tag = 'div' }` rendered as `<Tag>` reports as unused. A gate that emits
      // phantom errors trains people to ignore it, so this is load-bearing.
      'react/jsx-uses-vars': 'error',
      // The rules that catch real React bugs. A missing dependency here is the classic
      // stale-closure defect, which renders fine and then misbehaves at runtime.
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // Unused vars are how the truncated-file incident in src/lib/links.js would have
      // surfaced: a dropped export leaves its importers referencing nothing.
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^_' }],
    },
  },

  // Build and tooling scripts. These run under Node, so they get Node globals and none of
  // the React rules.
  {
    files: ['scripts/**/*.{js,mjs}', '*.config.js'],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: globals.node,
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
];
