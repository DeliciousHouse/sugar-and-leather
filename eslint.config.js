// Flat config (ESLint 9). Deliberately small.
//
// Three earlier attempts at this gate (PRs #9, #14, #15) were all closed unmerged, and
// every blocking finding was a fail-open path in the gate's OWN machinery rather than in
// the code it was supposed to check: diff-scoping that skipped cross-config dependents, a
// TypeScript baseline that could be deleted and regrown to launder a new error, tsconfigs
// that could be renamed to bypass checking.
//
// Those mechanisms exist to retrofit a gate onto a codebase that already has violations.
// This repository is small enough to lint every tracked program on every run, with no
// diagnostic baseline to tamper with and no diff scope to bypass.

import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  { ignores: ['dist/**', 'node_modules/**'] },

  // Fail-closed catch-all. Every JavaScript-family program starts with substantive rules,
  // including new files that have not yet been assigned runtime-specific globals below.
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^_' }],
    },
  },

  // Browser programs deliberately receive no Node globals: a stray `process` or `Buffer`
  // is a runtime crash, not a type error.
  {
    files: ['src/**/*.{js,jsx}', 'js/**/*.js', 'tweaks-panel.jsx'],
    languageOptions: {
      globals: {
        ...globals.browser,
        React: 'readonly',
      },
    },
  },

  // React correctness rules cover both the Vite app and standalone Babel tweaks scaffold.
  {
    files: ['src/**/*.{js,jsx}', 'tweaks-panel.jsx'],
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    rules: {
      // JSX tag references must count as variable uses (for example `{ as: Tag }` + `<Tag>`).
      'react/jsx-uses-vars': 'error',
      ...reactHooks.configs.recommended.rules,
    },
  },

  // Fast Refresh only applies to the Vite app; the standalone Babel scaffold has no HMR.
  {
    files: ['src/**/*.{js,jsx}'],
    plugins: {
      'react-refresh': reactRefresh,
    },
    rules: {
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },

  // Build, server, config, and gate-test programs run under Node.
  {
    files: [
      'scripts/**/*.{js,mjs,cjs}',
      'server/**/*.{js,mjs,cjs}',
      'tests/**/*.{js,mjs,cjs}',
      '*.config.js',
      'eslint.config.js',
    ],
    languageOptions: {
      globals: globals.node,
    },
  },
];
