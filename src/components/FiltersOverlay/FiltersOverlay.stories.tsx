import Card from "@leafygreen-ui/card";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import FiltersOverlay from ".";

export default {
  title: "Components/FiltersOverlay",
  component: FiltersOverlay,
} as ComponentMeta<typeof FiltersOverlay>;

const DefaultTemplate: ComponentStory<typeof FiltersOverlay> = (args) => (
  <Card style={{ maxWidth: 650 }}>
    <FiltersOverlay {...args} />
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

const WithFiltersTemplate: ComponentStory<typeof FiltersOverlay> = (args) => (
  <Card style={{ maxWidth: 650 }}>
    <FiltersOverlay {...args} />
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
