import Card from "@leafygreen-ui/card";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import DetailsOverlay from ".";

export default {
  title: "Components/DetailsOverlay",
  component: DetailsOverlay,
} as ComponentMeta<typeof DetailsOverlay>;

const DefaultTemplate: ComponentStory<typeof DetailsOverlay> = (args) => (
  <Card style={{ maxWidth: 750 }}>
    <DetailsOverlay {...args} />
  </Card>
);

export const Default = DefaultTemplate.bind({});

Default.decorators = [
  (Story) => (
    <MemoryRouter initialEntries={["/"]}>
      <Story />
    </MemoryRouter>
  ),
];
