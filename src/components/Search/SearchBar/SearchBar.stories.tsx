import { CustomMeta, CustomStoryObj } from "test_utils/types";

import SearchBar from ".";

export default {
  component: SearchBar,
} satisfies CustomMeta<typeof SearchBar>;

export const Default: CustomStoryObj<typeof SearchBar> = {
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

export const WithSearchSuggestions: CustomStoryObj<typeof SearchBar> = {
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
