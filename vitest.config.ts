import { fileURLToPath } from 'node:url'

import { defineVitestProject } from '@nuxt/test-utils/config'
import { defineConfig } from 'vitest/config'

// See: https://github.com/vitest-dev/vitest/issues/8757
const nodeMajor = Number(process.versions.node.split('.')[0])
const execArgv = nodeMajor >= 26 ? ['--no-webstorage'] : []

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          include: ['test/unit/**/*.{test,spec}.ts'],
          environment: 'node',
        },
      },
      await defineVitestProject({
        test: {
          name: 'nuxt',
          execArgv,
          include: ['test/nuxt/**/*.{test,spec}.ts'],
          environment: 'nuxt',
          environmentOptions: {
            nuxt: {
              rootDir: fileURLToPath(new URL('.', import.meta.url)),
              domEnvironment: 'jsdom',
            },
          },
        },
      }),
    ],
    coverage: {
      provider: 'v8',
      exclude: ['./paraglide/**'],
    },
  },
})
