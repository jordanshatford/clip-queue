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
    extends: [
      'plugin:vue/vue3-recommended',
      'eslint:recommended',
      '@vue/eslint-config-typescript',
      '@vue/eslint-config-prettier/skip-formatting'
    ],
    parserOptions: {
      ecmaVersion: 'latest'
    }
  })
]
