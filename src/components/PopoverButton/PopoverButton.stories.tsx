import { ComponentMeta, ComponentStory } from "@storybook/react";
import PopoverButton from ".";

export default {
  title: "Components/PopoverButton",
  component: PopoverButton,
} as ComponentMeta<typeof PopoverButton>;

const Template: ComponentStory<typeof PopoverButton> = (args) => (
  <PopoverButton {...args}>Some Content</PopoverButton>
);

export const Default = Template.bind({});

Default.args = {
  buttonText: "Popover Button",
};
