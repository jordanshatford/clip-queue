import js from '@eslint/js'
import prettier from '@vue/eslint-config-prettier'
import ts from '@vue/eslint-config-typescript'
import vue from 'eslint-plugin-vue'

import { ignores } from './typescript.js'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores
  },
  ...vue.configs['flat/recommended'],
  js.configs.recommended,
  ...ts(),
  prettier
]
