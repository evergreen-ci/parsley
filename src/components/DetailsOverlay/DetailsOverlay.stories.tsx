import Card from "@leafygreen-ui/card";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import DetailsOverlay from ".";

export default {
  title: "Components/DetailsOverlay",
  component: DetailsOverlay,
} as ComponentMeta<typeof DetailsOverlay>;

// Default DetailsOverlay (no filters)
const DefaultTemplate: ComponentStory<typeof DetailsOverlay> = (args) => (
  <Card style={{ maxWidth: 720 }}>
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

// DetailsOverlay with filters
const WithFiltersTemplate: ComponentStory<typeof DetailsOverlay> = (args) => (
  <Card style={{ maxWidth: 720 }}>
    <DetailsOverlay {...args} />
  </Card>
);

export const WithFilters = WithFiltersTemplate.bind({});

WithFilters.decorators = [
  (Story) => (
    <MemoryRouter initialEntries={["/?filters=filter1,filter2"]}>
      <Story />
    </MemoryRouter>
  ),
];
