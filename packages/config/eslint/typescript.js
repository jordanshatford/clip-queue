import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'

const compat = new FlatCompat({
  recommendedConfig: js.configs.recommended
})

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    ignores: [
      '.DS_Store',
      'dist/*',
      'node_modules/*',
      '.env',
      '.env.*',
      '!.env.sample',
      'pnpm-lock.yaml',
      'package-lock.json',
      'yarn.lock'
    ]
  },
  ...compat.config({
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    parserOptions: {
      sourceType: 'module',
      ecmaVersion: 2020
    },
    env: {
      browser: true,
      es2017: true,
      node: true
    }
  })
]
