import { CustomMeta, CustomStoryObj } from "test_utils/types";
import PopoverButton from ".";

export default {
  component: PopoverButton,
} satisfies CustomMeta<typeof PopoverButton>;

export const Default: CustomStoryObj<typeof PopoverButton> = {
  render: (args) => <PopoverButton {...args}>Some Content</PopoverButton>,

  args: {
    buttonText: "Popover Button",
  },
};
