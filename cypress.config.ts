import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "i1oeyf",
  e2e: {
    baseUrl: "http://localhost:4173",
    supportFile: "cypress/support/index.ts",
    specPattern: "cypress/integration/**/*.ts",
    experimentalStudio: true,
    experimentalSessionAndOrigin: true,
    testIsolation: "legacy",
  },
  reporterOptions: {
    mochaFile: "bin/cypress/cypress-[hash].xml",
  },
  viewportWidth: 1280,
  viewportHeight: 800,
  videoCompression: false,
});
