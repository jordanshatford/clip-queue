import js from '@eslint/js'
import vitest from '@vitest/eslint-plugin'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import prettier from 'eslint-config-prettier'
import vue from 'eslint-plugin-vue'

export default defineConfigWithVueTs([
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
      'yarn.lock',
      'src/paraglide/*',
      'src/components/ui/volt/*',
    ],
  },
  ...vue.configs['flat/recommended'],
  js.configs.recommended,
  vueTsConfigs.recommended,
  {
    ...vitest.configs.recommended,
    files: ['**/__tests__/*.{ts,vue}'],
  },
  prettier,
])
