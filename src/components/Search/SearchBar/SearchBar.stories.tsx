import { StoryObj } from "@storybook/react";

import SearchBar from ".";

export default {
  component: SearchBar,
};

export const Default: StoryObj<typeof SearchBar> = {
  args: {
    disabled: false,
    validator(value) {
      return value.length > 3;
    },
    searchSuggestions: [],
  },
  argTypes: {
    disabled: { control: "boolean", description: "Should disable input" },
    validator: {
      control: "func",
      description: "Function to validate input",
      defaultValue: "() => true",
    },
  },
};

export const WithSearchSuggestions: StoryObj<typeof SearchBar> = {
  args: {
    disabled: false,
    validator(value) {
      return value !== "bad";
    },
    searchSuggestions: [
      "console.log",
      "console.warn",
      "console.debug",
      "console.error",
      "console.table",
      "console.group",
      "console.time",
      "console.timeEnd",
      "console.clear",
      "console.dir",
      "console.count",
      "console.info",
      "console.dir",
    ],
  },
  argTypes: {
    disabled: { control: "boolean", description: "Should disable input" },
    validator: {
      control: "func",
      description: "Function to validate input",
      defaultValue: "() => true",
    },
  },
};
