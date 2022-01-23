module.exports = {
  preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",
  transform: {
    "^.+\\.vue$": "vue-jest",
  },
  collectCoverageFrom: ["src/**/*.{js,ts,vue}", "!src/assets/**/*", "!src/router/**/*", "!src/main.ts"],
  coverageDirectory: "<rootDir>/tests/coverage",
  // TODO: add back once tests reach this threshold
  // coverageThreshold: {
  //   global: {
  //     branches: 80,
  //     functions: 80,
  //     lines: 80,
  //     statements: 80,
  //   },
  // },
};
