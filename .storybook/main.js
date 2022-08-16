module.exports = {
  stories: ["../src/stories/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-links",
    "@storybook/addon-storyshots",
  ],
  framework: "@storybook/react",
  core: {
    builder: "@storybook/builder-vite",
  },
  features: {
    // storyStoreV7 is enabled by default and works well for our general Storybook configuration.
    // However, we have to disable it because it breaks storyshots. Storybook developers are working
    // on a new replacement addon for storyshots to fix this in the future.
    // (https://github.com/storybookjs/storybook/issues/15916)
    storyStoreV7: false,
  },
  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      compilerOptions: {
        allowSyntheticDefaultImports: false,
        esModuleInterop: false,
      },
    },
  },
};
