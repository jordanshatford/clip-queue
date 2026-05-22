import { fileURLToPath } from 'node:url'

import { paraglideVitePlugin } from '@inlang/paraglide-js'

import pkg from './package.json' with { type: 'json' }

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/test-utils', '@nuxt/ui', '@pinia/nuxt', '@vueuse/nuxt'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  ssr: false,
  app: {
    head: {
      title: 'Clip Queue',
      htmlAttrs: {
        lang: 'en',
        dir: 'ltr',
      },
      meta: [{ name: 'description', content: 'An enhanced clip viewing experience.' }],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  runtimeConfig: {
    public: {
      version: pkg.version,
      twitchClientId: '',
      twitchRedirectUri: '',
    },
  },
  alias: {
    '#paraglide': fileURLToPath(new URL('./paraglide', import.meta.url)),
  },
  vite: {
    optimizeDeps: {
      include: ['@tanstack/vue-table', '@tmi.js/chat', '@vueuse/core', 'video.js'],
    },
    plugins: [
      paraglideVitePlugin({
        project: './project.inlang',
        outdir: fileURLToPath(new URL('./paraglide', import.meta.url)),
      }),
    ],
  },
  typescript: {
    tsConfig: {
      compilerOptions: {
        paths: {
          '#paraglide/*': ['../paraglide/*'],
        },
      },
    },
  },
})
