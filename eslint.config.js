import { defineConfig } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import eslintConfigPrettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default defineConfig(
  {
    // Claude Code worktrees are full checkouts of this repo.
    ignores: ['.claude/**']
  },
  ...nextVitals,
  ...nextTypescript,
  {
    files: ['**/*.{ts,tsx}'],
    extends: [tseslint.configs.recommendedTypeCheckedOnly],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      '@typescript-eslint/no-floating-promises': [
        'error',
        {
          // The node:test runner awaits each test; the file that declares it does not.
          allowForKnownSafeCalls: [
            { from: 'package', package: 'node:test', name: 'test' }
          ]
        }
      ]
    }
  },
  eslintConfigPrettier
);
