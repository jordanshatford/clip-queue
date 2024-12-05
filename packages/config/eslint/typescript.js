import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import globals from 'globals'
import ts from 'typescript-eslint'

export const ignores = [
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

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2017,
        ...globals.node
      },
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
      }
    }
  },
  prettier
]
