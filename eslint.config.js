import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['node_modules/', 'test-results/', 'playwright-report/'] },
  js.configs.recommended,
  {
    files: ['app/js/**/*.js'],
    languageOptions: { ecmaVersion: 2022, sourceType: 'module', globals: globals.browser },
  },
  {
    files: ['app/sw.js'],
    languageOptions: { ecmaVersion: 2022, sourceType: 'script', globals: globals.serviceworker },
  },
  {
    files: ['tests/**/*.js', 'tests/**/*.mjs', 'eslint.config.js', 'playwright.config.js'],
    languageOptions: { ecmaVersion: 2022, sourceType: 'module', globals: globals.node },
  },
  {
    // E2E: Callbacks in page.evaluate laufen im Browser
    files: ['tests/e2e/**/*.js'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
  {
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'prefer-const': 'error',
      eqeqeq: ['error', 'smart'],
    },
  },
];
