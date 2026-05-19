import skipFormatting from 'eslint-config-prettier/flat'

import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Skip formatting related rules since we use Oxfmt for that.
  skipFormatting,
  // Ignore Paraglide generated translation files.
  {
    ignores: ['./src/paraglide/**'],
  },
)
