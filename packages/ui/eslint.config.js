import vue from '@cq/config/eslint/vue'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ['src/volt']
  },
  ...vue
]
