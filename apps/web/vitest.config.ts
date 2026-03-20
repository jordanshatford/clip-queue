import { fileURLToPath } from 'node:url'

import { configDefaults, defineProject, mergeConfig } from 'vitest/config'

import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineProject({
    test: {
      environment: 'jsdom',
      alias: {
        '\\.(png|jpg|jpeg|gif|svg)$': 'src/__tests__/fileMock.ts',
      },
      setupFiles: ['src/__tests__/setup.js'],
      exclude: [...configDefaults.exclude, 'e2e/*'],
      root: fileURLToPath(new URL('./', import.meta.url)),
    },
  }),
)
