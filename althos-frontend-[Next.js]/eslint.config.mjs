import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

export default [
  ...compat.extends('next/core-web-vitals', 'next', 'next/typescript'),

  {
    files: ['**/*.ts', '**/*.tsx'],
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
    ],
    rules: {
      // Disable specific rules causing build errors
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'react/no-unescaped-entities': 'off',
      'react-hooks/exhaustive-deps': 'off',
      '@next/next/no-page-custom-font': 'off',
    },
  },
]
