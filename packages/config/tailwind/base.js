import primevue from 'tailwindcss-primeui'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{vue,js,ts,jsx,tsx}',
    '../../apps/*/src/**/*.{vue,js,ts,jsx,tsx}',
    '../../packages/*/src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  darkMode: ['selector', '[class*="app-dark"]'],
  plugins: [primevue]
}
