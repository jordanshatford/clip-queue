/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [require.resolve('@cq/config/eslint/vue')],
  ignorePatterns: ['src/assets/presets/**/*.js']
}
