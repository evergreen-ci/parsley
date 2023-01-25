module.exports = {
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-essentials", "@storybook/addon-interactions", "@storybook/addon-links",
  // React 18 causes some issues with storyshots. In package.json we have a resolutions field for
  // react-test-renderer to get around this. (https://github.com/storybookjs/storybook/issues/17985)
  "@storybook/addon-storyshots"],
  framework: {
    name: "@storybook/react-vite",
    options: {}
  },
  features: {
    // storyStoreV7 is enabled by default and works well for our general Storybook configuration.
    // However, we have to disable it because it breaks storyshots. Storybook developers are working
    // on a new replacement addon for storyshots to fix this in the future.
    // (https://github.com/storybookjs/storybook/issues/15916)
    storyStoreV7: false
  },
  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      compilerOptions: {
        allowSyntheticDefaultImports: false,
        esModuleInterop: false
      }
    }
  },
  async viteFinal(config, {
    configType
  }) {
    const {
      loadConfigFromFile,
      mergeConfig
    } = require("vite");
    const path = require("path");

    // Load our Vite config file.
    const {
      config: viteConfig
    } = await loadConfigFromFile(configType, path.resolve(__dirname, "../vite.config.ts"));

    // Filter out Storybook's duplicate "vite:react-babel" plugin.
    config.plugins = config.plugins.filter(plugin => {
      if (Array.isArray(plugin) && plugin.some(p => p.name === "vite:react-babel")) {
        return false;
      }
      return true;
    });

    // Add a special configuration for production.
    if (configType === "PRODUCTION") {
      // We need to override the 'base' property so that the path to storybook-static/assets
      // is correct. (https://github.com/storybookjs/builder-vite/issues/475)
      config.base = "./";
    }
    return mergeConfig(viteConfig, config);
  },
  docs: {
    autodocs: true
  }
};