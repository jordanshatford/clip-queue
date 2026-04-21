import { defineConfig } from 'oxfmt'

export default defineConfig({
  ignorePatterns: ['**/.changeset/**', '**/dist/**', '**/node_modules/**'],
  semi: false,
  singleQuote: true,
  sortImports: {
    groups: [
      'type-builtin',
      'value-builtin',
      'type-external',
      'value-external',
      'type-internal',
      'value-internal',
      ['type-parent', 'type-sibling', 'type-index'],
      ['value-parent', 'value-sibling', 'value-index'],
      'unknown',
    ],
  },
  sortPackageJson: {
    sortScripts: false,
  },
  sortTailwindcss: {
    stylesheet: './src/app.css',
    functions: ['clsx', 'cn'],
    preserveWhitespace: true,
  },
})
