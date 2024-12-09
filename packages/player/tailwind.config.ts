import { Config } from 'tailwindcss'

import preset from '@cq/config/tailwind'

export default {
  content: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
  presets: [preset]
} satisfies Config
