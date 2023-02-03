import { StoryObj } from "@storybook/react";
import Highlight from ".";

export default {
  component: Highlight,
};

export const Default: StoryObj<typeof Highlight> = {
  render: (args) => (
    <span>
      Should be <Highlight {...args}>highlighted</Highlight>
    </span>
  ),
};
