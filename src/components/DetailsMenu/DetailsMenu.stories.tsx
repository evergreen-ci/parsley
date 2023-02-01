import Card from "@leafygreen-ui/card";
import { StoryObj } from "@storybook/react";
import DetailsMenu from ".";

export default {
  component: DetailsMenu,
};

export const Default: StoryObj<typeof DetailsMenu> = {
  render: (args) => (
    <Card style={{ maxWidth: 750 }}>
      <DetailsMenu {...args} />
    </Card>
  ),
};
