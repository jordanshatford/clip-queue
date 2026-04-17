import vue from '@cq/config/eslint/vue'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    ignores: ['src/volt'],
  },
  ...vue,
])
