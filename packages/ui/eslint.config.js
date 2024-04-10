import vue from '@cq/config/eslint/vue'

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    ignores: ['src/primevue/presets/']
  },
  ...vue
]
