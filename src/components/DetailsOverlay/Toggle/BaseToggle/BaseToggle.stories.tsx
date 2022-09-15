import { ComponentMeta, ComponentStory } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import BaseToggle from ".";

export default {
  title: "Components/DetailsOverlay/Toggle",
  component: BaseToggle,
} as ComponentMeta<typeof BaseToggle>;

const DefaultTemplate: ComponentStory<typeof BaseToggle> = (args) => (
  <div style={{ width: 250 }}>
    <BaseToggle {...args} />
  </div>
);

export const Default = DefaultTemplate.bind({});

Default.args = {
  label: "Some field",
};

Default.decorators = [
  (Story) => (
    <MemoryRouter initialEntries={["/"]}>
      <Story />
    </MemoryRouter>
  ),
];
