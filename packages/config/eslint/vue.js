import js from '@eslint/js'
import prettier from '@vue/eslint-config-prettier'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import vue from 'eslint-plugin-vue'

import { ignores } from './typescript.js'

export default defineConfigWithVueTs([
  {
    ignores
  },
  ...vue.configs['flat/recommended'],
  js.configs.recommended,
  vueTsConfigs.recommended,
  prettier
])
