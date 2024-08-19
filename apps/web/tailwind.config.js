import primevue from 'tailwindcss-primeui'

import preset from '@cq/config/tailwind'

/** @type {import('tailwindcss').Config} */
export default {
  presets: [preset],
  darkMode: ['selector', '[class*="app-dark"]'],
  plugins: [primevue]
}
