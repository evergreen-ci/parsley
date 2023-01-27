import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-essentials", "@storybook/addon-interactions", "@storybook/addon-links",
  // React 18 causes some issues with storyshots. In package.json we have a resolutions field for
  // react-test-renderer to get around this. (https://github.com/storybookjs/storybook/issues/17985)
  "@storybook/addon-storyshots"],
  framework: {
    name: "@storybook/react-vite",
    options: {}
  },
  docs: {
    autodocs: true
  }
};

module.exports = config;