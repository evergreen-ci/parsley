import { ComponentMeta, ComponentStory } from "@storybook/react";
import LoadingBar from ".";

export default {
  title: "pages/LoadingPage/LoadingBar",
  component: LoadingBar,
} as ComponentMeta<typeof LoadingBar>;

const Template: ComponentStory<typeof LoadingBar> = (args) => (
  <LoadingBar {...args} />
);

export const Default = Template.bind({});
