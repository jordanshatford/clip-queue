import { defineConfig } from 'oxlint'

export default defineConfig({
  plugins: ['eslint', 'typescript', 'unicorn', 'oxc', 'vue', 'vitest'],
  env: {
    browser: true,
  },
  globals: {
    definePage: 'readonly',
  },
  categories: {
    correctness: 'error',
  },
})
