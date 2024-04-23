import base from './base.js'

/** @type {import("prettier").Config} */
export default {
  ...base,
  plugins: [...base.plugins, 'prettier-plugin-tailwindcss']
}
