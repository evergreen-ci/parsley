import { StoryObj } from "@storybook/react";
import Accordion from ".";

export default {
  component: Accordion,
};

export const Default: StoryObj<typeof Accordion> = {
  render: (args) => <Accordion {...args} />,
  args: {
    children: "Accordion content",
    subtitle: "Subtitle",
    title: "Accordion",
    toggledTitle: "Toggled Accordion",
  },
};
