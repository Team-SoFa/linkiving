import { FlatCompat } from '@eslint/eslintrc';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettierConfig from 'eslint-config-prettier';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import storybookPlugin from 'eslint-plugin-storybook';
import validateFilename from 'eslint-plugin-validate-filename';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const config = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      prettier: prettierPlugin,
      'jsx-a11y': jsxA11yPlugin,
      storybook: storybookPlugin,
      'validate-filename': validateFilename,
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      'require-jsdoc': 'off',
      'react/display-name': 'off',
      'react-hooks/exhaustive-deps': 'warn',
      'prettier/prettier': 'error',
      'jsx-a11y/anchor-is-valid': [
        'error',
        {
          components: ['Link'],
          specialLink: ['hrefLeft', 'hrefRight'],
          aspects: ['invalidHref', 'preferButton'],
        },
      ],
      'validate-filename/naming-rules': [
        'error',
        {
          rules: [
            {
              case: 'pascal',
              target: 'src/components/**/*',
              excludes: ['src/components/**/hooks/**/*'],
            },
            {
              case: 'camel',
              target: '**/hooks/**', // target "hooks" folder
              patterns: '^use', // file names begin with "use".
            },
          ],
        },
      ],
    },
  },
  prettierConfig,
];

export default config;
