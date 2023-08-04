import { CustomMeta, CustomStoryObj } from "test_utils/types";
import Highlight, { highlightColorList } from ".";

export default {
  argTypes: {
    color: {
      control: "select",
      options: highlightColorList,
    },
  },
  component: Highlight,
} satisfies CustomMeta<typeof Highlight>;

export const DefaultHighlight: CustomStoryObj<typeof Highlight> = {
  render: (args) => (
    <span>
      Should be <Highlight {...args}>highlighted</Highlight>
    </span>
  ),
};

export const AllColors: CustomStoryObj<typeof Highlight> = {
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
