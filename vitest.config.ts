import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      include: ['apps/**', 'packages/**'],
      exclude: ['apps/web/src/assets/**', '**/*.config.js', '**/*.eslintrc.cjs', '**/*.d.ts']
    }
  }
});
