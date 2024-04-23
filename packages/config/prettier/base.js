/** @type {import("prettier").Config} */
export default {
  semi: false,
  tabWidth: 2,
  singleQuote: true,
  printWidth: 100,
  trailingComma: 'none',
  plugins: ['@ianvs/prettier-plugin-sort-imports'],
  importOrder: [
    '<TYPES>^(node:)',
    '<BUILT_IN_MODULES>',
    '',
    '<TYPES>',
    '<THIRD_PARTY_MODULES>',
    '',
    '<TYPES>^@cq/(.*)$',
    '^@cq/(.*)$',
    '',
    '<TYPES>^@/(.*)$',
    '^@/(.*)$',
    '<TYPES>^[.]',
    '^[.]'
  ],
  importOrderTypeScriptVersion: '5.0.0'
}
