/** @type {import("prettier").Config} */
export default {
  semi: false,
  tabWidth: 2,
  singleQuote: true,
  printWidth: 100,
  plugins: ['@ianvs/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],
  importOrder: [
    '<TYPES>^(node:)',
    '<BUILT_IN_MODULES>',
    '',
    '<TYPES>',
    '<THIRD_PARTY_MODULES>',
    '',
    '<TYPES>^@/(.*)$',
    '^@/(.*)$',
    '<TYPES>^[.]',
    '^[.]',
  ],
  importOrderTypeScriptVersion: '5.0.0',
}
