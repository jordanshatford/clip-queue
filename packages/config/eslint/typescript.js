import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import { defineConfig } from 'eslint/config'
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
  'yarn.lock',
]

export default defineConfig([
  {
    ignores,
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2017,
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
  },
  prettier,
])
