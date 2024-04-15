import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      include: ['apps/**', 'packages/**'],
      exclude: [
        '**/*.config.js',
        '**/*.d.ts',
        'packages/config/**',
        'packages/ui/src/primevue/presets/**'
      ]
    }
  }
});
