import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

// Adapt legacy config to flat config
const compat = new FlatCompat();

export default [
  js.configs.recommended,
  ...compat.extends(
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended'
  ),
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        },
      },
    },
    plugins: {
      'react': reactPlugin,
      'react-hooks': reactHooksPlugin,
      '@typescript-eslint': tsPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // Disable common rules that might be problematic in this codebase
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-console': 'off',
      'react/no-unescaped-entities': 'off',
      'react/no-unknown-property': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', 'cypress/**/*.ts'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    // Let's specifically loosen rules for script files
    files: ['scripts/**/*.{js,ts}'],
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
        setTimeout: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
        module: 'readonly',
      }
    },
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    }
  },
  {
    // Config files are often written in CommonJS
    files: ['*.config.{js,ts}'],
    languageOptions: {
      globals: {
        require: 'readonly',
        module: 'readonly',
      }
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      'no-undef': 'off',
    }
  },
  {
    // Ignore directories and files we don't want to lint
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      '.husky/**',
      'temp/**',
      'mock-backend/**',
      '.prettierrc',
      '.prettierrc.js',
      'cypress/**'
    ],
  },
]; 