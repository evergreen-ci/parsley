import { StoryObj } from "@storybook/react";
import PopoverButton from ".";

export default {
  component: PopoverButton,
};

export const Default: StoryObj<typeof PopoverButton> = {
  render: (args) => <PopoverButton {...args}>Some Content</PopoverButton>,

  args: {
    buttonText: "Popover Button",
  },
};
