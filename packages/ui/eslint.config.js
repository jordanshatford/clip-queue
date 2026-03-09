import { defineConfig } from 'eslint/config'

import vue from '@cq/config/eslint/vue'

export default defineConfig([
  {
    ignores: ['src/volt']
  },
  ...vue
])
