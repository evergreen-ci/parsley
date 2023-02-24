import { Meta, StoryObj } from "@storybook/react";
import Highlight, { highlightColorList } from ".";

export const Default: StoryObj<typeof Highlight> = {
  render: (args) => (
    <span>
      Should be <Highlight {...args}>highlighted</Highlight>
    </span>
  ),
};

export const AllColors: StoryObj<typeof Highlight> = {
  render: (args) => (
    <div>
      {highlightColorList.map((color) => (
        <div key={color}>
          Should be{" "}
          <Highlight {...args} color={color}>
            highlighted
          </Highlight>
        </div>
      ))}
    </div>
  ),
};
const meta: Meta<typeof Highlight> = {
  component: Highlight,
  argTypes: {
    color: {
      control: "select",
      options: highlightColorList,
    },
  },
};

export default meta;
