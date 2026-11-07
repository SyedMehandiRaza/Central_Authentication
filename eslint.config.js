import js from '@eslint/js';
import globals from 'globals';

export default [
  // models/ is the git-ignored Fyinder reference code, read only.
  { ignores: ['**/node_modules/**', '**/coverage/**', '.claude/**', 'models/**'] },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: { sourceType: 'module', globals: globals.node },
  },
  {
    files: ['**/*.cjs', '**/.sequelizerc'],
    languageOptions: { sourceType: 'commonjs', globals: globals.node },
  },
  {
    files: ['**/__tests__/**', '**/src/test/**'],
    languageOptions: { globals: { ...globals.node, ...globals.jest } },
  },
];
