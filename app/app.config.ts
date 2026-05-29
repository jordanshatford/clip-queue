import type { ToasterProps } from '@nuxt/ui'

export default defineAppConfig({
  cq: {
    title: 'ClipQueue',
    github: 'https://github.com/jordanshatford/clip-queue',
    copyright: 2021,
  },
  toaster: {
    expand: false,
  } as ToasterProps,
  ui: {
    colors: {
      primary: 'purple',
      neutral: 'neutral',
    },
  },
})
