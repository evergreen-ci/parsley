import { useState } from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import Toggle from ".";

export default {
  title: "Components/FiltersOverlay/Toggle",
  component: Toggle,
} as ComponentMeta<typeof Toggle>;

const DefaultTemplate: ComponentStory<typeof Toggle> = (args) => {
  const [active, setActive] = useState(true);
  return (
    <div style={{ width: 250 }}>
      <Toggle {...args} onChange={setActive} value={active} />
    </div>
  );
};

export const Default = DefaultTemplate.bind({});

Default.args = {
  leftText: "Match",
  rightText: "Inverse",
};

Default.decorators = [
  (Story) => (
    <MemoryRouter initialEntries={["/"]}>
      <Story />
    </MemoryRouter>
  ),
];
