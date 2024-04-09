import base from './base.js'

/** @type {import("prettier").Config} */
export default {
  ...base,
  plugins: ['prettier-plugin-tailwindcss']
}
