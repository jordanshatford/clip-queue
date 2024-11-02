import js from '@eslint/js'
import vuePrettier from '@vue/eslint-config-prettier'
import vueTs from '@vue/eslint-config-typescript'
import vue from 'eslint-plugin-vue'

/** @type {import('eslint').Linter.Config[]} */
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
  ...vue.configs['flat/recommended'],
  js.configs.recommended,
  ...vueTs(),
  vuePrettier
]
