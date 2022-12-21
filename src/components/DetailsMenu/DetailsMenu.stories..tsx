import Card from "@leafygreen-ui/card";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import DetailsMenu from ".";

export default {
  title: "Components/DetailsMenu",
  component: DetailsMenu,
} as ComponentMeta<typeof DetailsMenu>;

const DefaultTemplate: ComponentStory<typeof DetailsMenu> = (args) => (
  <Card style={{ maxWidth: 750 }}>
    <DetailsMenu {...args} />
  </Card>
);

export const Default = DefaultTemplate.bind({});
