import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      include: ['apps/**'],
      exclude: ['apps/web/src/assets/**', '**/*.config.js', '**/*.eslintrc.cjs', '**/*.d.ts']
    }
  }
});
