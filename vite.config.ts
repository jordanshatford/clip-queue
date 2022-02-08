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
    setupFiles: ["tests/unit/setup.js"],
    coverage: {
      include: ["src/**/*"],
      exclude: ["src/assets/**/*", "src/router/**/*", "src/main.ts", "src/services/twitch-chat.ts", "tests/**/*"],
      reporter: ["text", "json", "html"],
    },
  },
})
