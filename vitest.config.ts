import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    projects: [
      'apps/*',
    ],
    coverage: {
      provider: 'v8',
      include: ['apps/**'],
      exclude: [
        '**/*.config.js',
        '**/*.d.ts'
      ]
    }
  }
});
