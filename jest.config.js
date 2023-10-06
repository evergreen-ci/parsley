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
  setupFiles: ["./jest.setup.ts"],
  preset: "ts-jest",
  resetMocks: true,
  setupFilesAfterEnv: ["<rootDir>/config/jest/setupTests.ts"],
  snapshotSerializers: ["@emotion/jest/serializer"],
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}"],
  testRunner: "<rootDir>/node_modules/jest-circus/runner.js",
  transform: {
    "^.+\\.graphql$": "@graphql-tools/jest-transform",
    "^.+\\.(js|jsx|mjs|cjs|ts|tsx)$": "ts-jest",
    "^.+\\.css$": "<rootDir>/config/jest/cssTransform.js",
    "^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)":
      "<rootDir>/config/jest/svgTransform.js",
  },
  transformIgnorePatterns: [
    `<rootDir>/node_modules/(?!${[
      // jest doesn't officially support ESM so ignore ansi_up: https://jestjs.io/docs/ecmascript-modules
      "ansi_up",
      // The following modules are all related to the query-string package.
      "query-string",
      "decode-uri-component",
      "split-on-first",
      "filter-obj",
    ].join("|")})`,
  ],
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
  ],

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
};
