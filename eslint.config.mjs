import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // Prettier Plugin
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      'object-curly-spacing': 'off',
      'prettier/prettier': 'warn',
    },
  },

  prettierConfig,
];

export default eslintConfig;
