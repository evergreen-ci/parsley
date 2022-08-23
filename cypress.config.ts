import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "i1oeyf",
  e2e: {
    baseUrl: "http://localhost:4173",
    supportFile: "cypress/support/index.ts",
    specPattern: "cypress/integration/**/*.ts",
  },
  reporterOptions: {
    mochaFile: "bin/cypress/cypress-[hash].xml",
  },
  viewportWidth: 1920,
  viewportHeight: 1080,
  videoCompression: false,
});
