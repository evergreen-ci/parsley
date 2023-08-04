import { CustomMeta, CustomStoryObj } from "test_utils/types";

import SearchBar from ".";

export default {
  component: SearchBar,
} satisfies CustomMeta<typeof SearchBar>;

export const Default: CustomStoryObj<typeof SearchBar> = {
  argTypes: {
    disabled: { control: "boolean", description: "Should disable input" },
    validator: {
      control: "func",
      defaultValue: "() => true",
      description: "Function to validate input",
    },
  },
  args: {
    disabled: false,
    searchSuggestions: [],
    validator(value) {
      return value.length > 3;
    },
  },
};

export const WithSearchSuggestions: CustomStoryObj<typeof SearchBar> = {
  argTypes: {
    disabled: { control: "boolean", description: "Should disable input" },
    validator: {
      control: "func",
      defaultValue: "() => true",
      description: "Function to validate input",
    },
  },
  args: {
    disabled: false,
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
    validator(value) {
      return value !== "bad";
    },
  },
};
