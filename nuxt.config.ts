import { fileURLToPath } from 'node:url'

import { paraglideVitePlugin } from '@inlang/paraglide-js'

import pkg from './package.json' with { type: 'json' }

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/test-utils', '@nuxt/ui', '@pinia/nuxt'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  ssr: false,
  runtimeConfig: {
    public: {
      version: pkg.version,
      twitchClientId: '',
      twitchRedirectUri: '',
    },
  },
  colorMode: {
    storageKey: 'vueuse-color-scheme',
  },
  vite: {
    optimizeDeps: {
      include: ['@tanstack/vue-table', '@tmi.js/chat', '@vueuse/core', 'video.js'],
    },
    plugins: [
      paraglideVitePlugin({
        project: './project.inlang',
        outdir: fileURLToPath(new URL('./app/paraglide', import.meta.url)),
      }),
    ],
  },
})
