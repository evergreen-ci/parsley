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
};
