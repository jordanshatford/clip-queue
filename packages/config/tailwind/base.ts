import type { Config } from 'tailwindcss'
import primevue from 'tailwindcss-primeui'

export default {
  content: [
    './src/**/*.{vue,js,ts,jsx,tsx}',
    '../../apps/*/src/**/*.{vue,js,ts,jsx,tsx}',
    '../../packages/*/src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  darkMode: ['selector', '[class*="app-dark"]'],
  plugins: [primevue]
} satisfies Config
