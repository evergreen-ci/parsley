import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  // This resolve field for leafygreen-ui emotion is to prevent LG from pulling in SSR dependencies.
  // It can be potentially be removed upon the completion of https://jira.mongodb.org/browse/PD-1543.
  resolve: {
    alias: {
      "@leafygreen-ui/emotion": path.resolve(
        __dirname,
        "./config/leafygreen-ui/emotion.ts"
      ),
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
  },
  plugins: [
    tsconfigPaths(),
    react({
      jsxImportSource: "@emotion/react", // This enables use of css prop on JSX.
      babel: {
        // @emotion/babel-plugin injects styled component names (e.g. "StyledSelect") into HTML for dev environments
        // only. It can be toggled for production environments by modifying the parameter autoLabel.
        // (https://emotion.sh/docs/@emotion/babel-plugin)
        plugins: ["@emotion/babel-plugin"],
      },
      exclude: /\.stories\.tsx?$/, // Exclude storybook stories from fast refresh.
      include: ["**/*.tsx", "**/*.ts"], // Only Typescript files should use fast refresh.
      fastRefresh: true,
    }),
    // Typescript checking
    checker({ typescript: true }),
  ],
  // Setting jsxImportSource to @emotion/react raises a warning in the console. This line silences
  // the warning. (https://github.com/vitejs/vite/issues/8644)
  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" },
  },
});
