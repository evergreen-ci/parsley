import { sentryVitePlugin } from "@sentry/vite-plugin";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import envCompatible from "vite-plugin-env-compatible";
import tsconfigPaths from "vite-tsconfig-paths";
import dns from "dns";
import path from "path";
import injectVariablesInHTML from "./config/injectVariablesInHTML";

// Remove when https://github.com/cypress-io/cypress/issues/25397 is resolved.
dns.setDefaultResultOrder("ipv4first");

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
    rollupOptions: {
      plugins: [
        injectVariablesInHTML({
          files: "dist/index.html",
          variables: [
            "%APP_VERSION%",
            "%GIT_SHA%",
            "%REACT_APP_RELEASE_STAGE%",
            "%NEW_RELIC_ACCOUNT_ID%",
            "%NEW_RELIC_TRUST_KEY%",
            "%NEW_RELIC_LICENSE_KEY%",
            "%PARSLEY_NEW_RELIC_AGENT_ID%",
            "%PARSLEY_NEW_RELIC_APPLICATION_ID%",
          ],
        }),
      ],
    },
  },
  // The resolve field for @leafygreen-ui/emotion is to prevent LG from pulling in SSR dependencies.
  // It can be potentially removed upon the completion of https://jira.mongodb.org/browse/PD-1543.
  resolve: {
    alias: {
      "@leafygreen-ui/emotion": path.resolve(
        __dirname,
        "./config/leafygreen-ui/emotion.ts",
      ),
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
  },
  plugins: [
    tsconfigPaths(),
    react({
      jsxImportSource: "@emotion/react", // Enables use of css prop on JSX.
      babel: {
        // @emotion/babel-plugin injects styled component names (e.g. "StyledSelect") into HTML for dev
        // environments only. It can be toggled for production environments by modifying the parameter
        // autoLabel. (https://emotion.sh/docs/@emotion/babel-plugin)
        plugins: ["@emotion/babel-plugin", "import-graphql"],
      },
      exclude: /\.stories\.tsx?$/, // Exclude storybook stories from fast refresh.
      include: ["**/*.tsx", "**/*.ts"], // Only Typescript files should use fast refresh.
      fastRefresh: true,
    }),
    envCompatible({
      prefix: "REACT_APP_",
    }),
    // Typescript checking
    checker({ typescript: true }),
    // Bundle analyzer
    visualizer({
      filename: "build/source_map.html",
      template: "treemap",
    }),
    sentryVitePlugin({
      org: "mongodb-org",
      project: "parsley",
      authToken: process.env.PARSLEY_SENTRY_AUTH_TOKEN,
      release: {
        name: process.env.npm_package_version,
      },
      sourcemaps: {
        assets: "dist/assets/*",
      },
    }),
  ],
  // Setting jsxImportSource to @emotion/react raises a warning in the console. This line silences
  // the warning. (https://github.com/vitejs/vite/issues/8644)
  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" },
  },
});
