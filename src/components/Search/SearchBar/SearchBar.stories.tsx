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
