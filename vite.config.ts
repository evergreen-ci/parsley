import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import envCompatible from "vite-plugin-env-compatible";
import vitePluginImp from "vite-plugin-imp";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";
import injectVariablesInHTML from "./config/injectVariablesInHTML";
import reactVirtualized from "./config/reactVirtualized";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      plugins: [
        injectVariablesInHTML({
          files: "dist/index.html",
          variables: ["%GIT_SHA%"],
        }),
      ],
    },
  },
  // The resolve field for @leafygreen-ui/emotion is to prevent LG from pulling in SSR dependencies.
  // It can be potentially be removed upon the completion of https://jira.mongodb.org/browse/PD-1543.
  resolve: {
    alias: {
      "@leafygreen-ui/emotion": path.resolve(
        __dirname,
        "./config/leafygreen-ui/emotion.ts"
      ),
      // CellMeasurerCache doesn't follow the same directory structure as the rest of the react-virtualized packages
      // so we need to alias it to the correct path.
      "react-virtualized/dist/es/CellMeasurerCache": path.resolve(
        "node_modules/react-virtualized/dist/es/CellMeasurer/CellMeasurerCache"
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
        plugins: ["@emotion/babel-plugin"],
      },
      exclude: /\.stories\.tsx?$/, // Exclude storybook stories from fast refresh.
      include: ["**/*.tsx", "**/*.ts"], // Only Typescript files should use fast refresh.
      fastRefresh: true,
    }),
    vitePluginImp({
      optimize: true,
      libList: [
        {
          libName: "react-virtualized",
          libDirectory: "dist/es",
          camel2DashComponentName: false,
        },
      ],
    }),
    reactVirtualized(),
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
  ],
  // Setting jsxImportSource to @emotion/react raises a warning in the console. This line silences
  // the warning. (https://github.com/vitejs/vite/issues/8644)
  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" },
  },
});
