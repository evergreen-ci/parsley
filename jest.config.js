module.exports = {
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!<rootDir>/node_modules/",
    "!<rootDir>/src/{main.tsx,vite-env.d.ts}",
  ],
  coverageReporters: ["text"],
  moduleFileExtensions: ["json", "js", "jsx", "ts", "tsx"],
  moduleNameMapper: {
    "^uuid$": "<rootDir>/node_modules/uuid/dist/index.js",
  },
  modulePaths: ["<rootDir>/src"],
  preset: "ts-jest",
  resetMocks: true,
  // Set the output directory for generating test results.
  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: "bin/jest",
        outputName: "junit.xml",
      },
    ],
  ],
  // jest-dom adds custom jest matchers for asserting on DOM nodes.
  // learn more: https://github.com/testing-library/jest-dom
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
  snapshotSerializers: ["@emotion/jest/serializer"],
  testEnvironment: "jsdom",
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
    "<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}",
  ],
  testRunner: "<rootDir>/node_modules/jest-circus/runner.js",
  transform: {
    "^.+\\.(js|jsx|mjs|cjs|ts|tsx)$": "<rootDir>/node_modules/ts-jest",
    "^.+\\.css$": "<rootDir>/config/jest/cssTransform.js",
    "^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)":
      "<rootDir>/config/jest/svgTransform.js",
  },
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
  ],
};
