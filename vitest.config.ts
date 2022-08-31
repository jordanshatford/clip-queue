import { mergeConfig } from "vite"
import { defineConfig } from "vitest/config"
import viteConfig from "./vite.config"

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      watch: false,
      setupFiles: ["src/__tests__/setup.js"],
      coverage: {
        include: ["src/**/*"],
        exclude: ["src/assets/**/*", "src/router/**/*", "src/main.ts", "src/**/__tests__/*"],
        reporter: ["lcov", "text"],
      },
    },
  })
)
