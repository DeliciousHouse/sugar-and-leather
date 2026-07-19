import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

const javascriptRules = {
  ...js.configs.recommended.rules,
  'no-shadow-restricted-names': 'off',
  'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  'react/jsx-uses-vars': 'error',
  'react-hooks/rules-of-hooks': 'error',
};

const javascriptPlugins = {
  react,
  'react-hooks': reactHooks,
};

const typescriptRecommendedRules = Object.assign(
  {},
  ...tseslint.configs.recommended.map((config) => config.rules ?? {}),
);

const typescriptRules = {
  ...javascriptRules,
  ...typescriptRecommendedRules,
  'no-undef': 'off',
  'no-unused-vars': 'off',
  '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
};

const typescriptPlugins = {
  ...javascriptPlugins,
  '@typescript-eslint': tseslint.plugin,
};

const reactSettings = {
  react: {
    version: 'detect',
  },
};

export default [
  {
    ignores: [
      'coverage/**',
      'dist/**',
      'js/**',
      'node_modules/**',
      'tweaks-panel.jsx',
    ],
  },
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: javascriptPlugins,
    rules: javascriptRules,
    settings: reactSettings,
  },
  {
    files: ['tests/**/*.{js,jsx,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: javascriptPlugins,
    rules: javascriptRules,
    settings: reactSettings,
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: typescriptPlugins,
    rules: typescriptRules,
    settings: reactSettings,
  },
  {
    files: ['tests/**/*.{ts,tsx,mts,cts}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: typescriptPlugins,
    rules: typescriptRules,
    settings: reactSettings,
  },
  {
    files: ['eslint.config.js', 'scripts/**/*.{js,mjs,cjs}', 'vite.config.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.node,
      parserOptions: {
        sourceType: 'module',
      },
    },
    plugins: javascriptPlugins,
    rules: javascriptRules,
  },
  {
    files: ['scripts/**/*.{ts,tsx,mts,cts}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.node,
      parser: tseslint.parser,
      parserOptions: {
        sourceType: 'module',
      },
    },
    plugins: typescriptPlugins,
    rules: typescriptRules,
  },
];
