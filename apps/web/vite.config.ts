import { fileURLToPath, URL } from 'node:url'

import { paraglide } from '@inlang/paraglide-vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    paraglide({
      project: './project.inlang',
      outdir: './src/paraglide'
    }),
    tailwindcss(),
    vue()
  ],
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
