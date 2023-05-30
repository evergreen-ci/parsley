import { StoryObj } from "@storybook/react";
import LoadingAnimation from ".";

export default {
  component: LoadingAnimation,
};

export const Default: StoryObj<typeof LoadingAnimation> = {
  render: (args) => <LoadingAnimation {...args} />,
  args: {},
  argTypes: {},
};
