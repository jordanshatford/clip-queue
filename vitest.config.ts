import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      include: ['apps/**', 'packages/**'],
      exclude: [
        '**/*.config.js',
        '**/*.eslintrc.cjs',
        '**/*.d.ts',
        'apps/web/src/assets/**',
        'packages/config/**'
      ]
    }
  }
});
