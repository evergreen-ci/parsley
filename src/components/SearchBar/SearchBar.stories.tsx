import { ComponentMeta, ComponentStory } from "@storybook/react";

import SearchBar from ".";

export default {
  title: "Components/SearchBar",
  component: SearchBar,
} as ComponentMeta<typeof SearchBar>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof SearchBar> = (args) => (
  <SearchBar {...args} />
);

export const Default = Template.bind({});

Default.args = {
  disabled: false,
  validator(value) {
    return value.length > 3;
  },
};

Default.argTypes = {
  disabled: { control: "boolean", description: "Should disable input" },
  validator: {
    control: "func",
    description: "Function to validate input",
    defaultValue: "() => true",
  },
};
