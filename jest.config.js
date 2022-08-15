module.exports = {
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!<rootDir>/node_modules/",
    "!<rootDir>/src/{main.tsx,vite-env.d.ts}",
  ],
  coverageReporters: ["text"],
  moduleFileExtensions: [
    "json",
    "js",
    "jsx",
    "ts",
    "tsx",
  ],
  moduleNameMapper: {
    // "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy", // Possibly enable in EVG-17445.
    "^uuid$": "<rootDir>/node_modules/uuid/dist/index.js",
  },
  modulePaths: ["<rootDir>/src"],
  preset: "ts-jest",
  resetMocks: true,
  // Set the output directory for generating test results.
  reporters: [
    'default',
    [ 'jest-junit', {
      outputDirectory: 'bin/jest',
      outputName: 'junit.xml',
    } ]
  ],
  setupFilesAfterEnv: ["<rootDir>/jest-setup.ts"],
  // snapshotSerializers: ["@emotion/jest/serializer"], // Possibly enable in EVG-17445.
  testEnvironment: "jsdom",
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
    "<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}",
  ],
  testRunner: "<rootDir>/node_modules/jest-circus/runner.js",
  transform: {
   "^.+\\.(js|jsx|mjs|cjs|ts|tsx)$": "<rootDir>/node_modules/ts-jest",
  //   "^.+\\.css$": "<rootDir>/config/jest/cssTransform.js", // Possibly enable in EVG-17445.
   },
  transformIgnorePatterns: [
    '<rootDir>/node_modules/',
      //   "^.+\\.module\\.(css|sass|scss)$", // Possibly enable in EVG-17445.
  ],
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
  ],
};
