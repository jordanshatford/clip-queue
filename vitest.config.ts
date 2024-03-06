import { fileURLToPath } from 'node:url'
import { mergeConfig, configDefaults, defineConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      watch: false,
      setupFiles: ["src/__tests__/setup.js"],
      exclude: [...configDefaults.exclude, 'e2e/*'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      coverage: {
        include: ["src/**"],
        exclude: ['src/assets/**']
      }
    }
  })
)
