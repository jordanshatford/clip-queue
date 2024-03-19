import { fileURLToPath } from 'node:url'
import { mergeConfig, configDefaults, defineProject } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineProject({
    test: {
      environment: 'jsdom',
      setupFiles: ['src/__tests__/setup.js'],
      exclude: [...configDefaults.exclude, 'e2e/*'],
      root: fileURLToPath(new URL('./', import.meta.url)),
    }
  })
)
