import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    supportFile: "cypress/support/index.ts",
    specPattern: "cypress/integration/**/*.ts",
  },
  reporterOptions: {
    mochaFile: "bin/cypress/cypress-[hash].xml",
  },
  viewportWidth: 1920,
  viewportHeight: 1080,
});
