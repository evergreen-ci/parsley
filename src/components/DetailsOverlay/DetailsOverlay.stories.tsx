import { ComponentMeta, ComponentStory } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import DetailsOverlay from ".";

export default {
  title: "Components/DetailsOverlay",
  component: DetailsOverlay,
} as ComponentMeta<typeof DetailsOverlay>;

const Template: ComponentStory<typeof DetailsOverlay> = (args) => (
  <DetailsOverlay {...args} />
);

export const Default = Template.bind({});

Default.decorators = [
  (Story) => (
    <MemoryRouter initialEntries={["/"]}>
      <Story />
    </MemoryRouter>
  ),
];
