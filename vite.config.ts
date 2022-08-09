import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import checker from "vite-plugin-checker";
import tsconfigPaths from "vite-tsconfig-paths";


// https://vitejs.dev/config/
export default defineConfig({
  // TODO EVG-17445: Add resolve field for leafygreen-ui/emotion.
  plugins: [
    tsconfigPaths(),
    // TODO EVG-17445: Support emotion JSX.
    react({
      fastRefresh: true,
    }),
    // Typescript checking
    checker({ typescript: true }),
  ]
})
