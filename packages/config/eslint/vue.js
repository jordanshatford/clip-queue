import js from '@eslint/js'
import vitest from '@vitest/eslint-plugin'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import prettier from 'eslint-config-prettier'
import vue from 'eslint-plugin-vue'

import { ignores } from './typescript.js'

export default defineConfigWithVueTs([
  {
    ignores,
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
