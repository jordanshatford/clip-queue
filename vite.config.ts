import { fileURLToPath, URL } from "url"

import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
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
