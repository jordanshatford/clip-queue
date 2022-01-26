module.exports = {
  preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",
  transform: {
    "^.+\\.vue$": "vue-jest",
  },
  collectCoverageFrom: [
    "src/**/*.{js,ts,vue}",
    "!src/assets/**/*",
    "!src/router/**/*",
    "!src/main.ts",
    "!src/services/twitch-chat.ts",
  ],
  coverageDirectory: "<rootDir>/tests/coverage",
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
