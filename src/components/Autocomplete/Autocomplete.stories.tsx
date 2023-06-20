import { StoryObj } from "@storybook/react";
import Icon from "components/Icon";
import Autocomplete from ".";

export default {
  component: Autocomplete,
};

export const Default: StoryObj<typeof Autocomplete> = {
  render: (args) => (
    <Autocomplete
      aria-labelledby="Autocomplete"
      icon={<Icon glyph="MagnifyingGlass" />}
      placeholder="Start typing to search"
      {...args}
    />
  ),
  args: {
    autocompleteSuggestions: [
      "ShardedClusterFixture:job0:mongos0",
      "console.warning",
      "console.log|console.error|console.debug",
    ],
  },
};
