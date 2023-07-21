import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:4173",
    experimentalStudio: true,
    specPattern: "cypress/integration/**/*.ts",
    supportFile: "cypress/support/index.ts",
  },
  projectId: "i1oeyf",
  reporterOptions: {
    mochaFile: "bin/cypress/cypress-[hash].xml",
  },
  videoCompression: false,
  viewportHeight: 800,
  viewportWidth: 1280,
});
