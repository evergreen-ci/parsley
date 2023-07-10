import { CustomMeta, CustomStoryObj } from "test_utils/types";
import LoadingAnimation from ".";

export default {
  component: LoadingAnimation,
} satisfies CustomMeta<typeof LoadingAnimation>;

export const Default: CustomStoryObj<typeof LoadingAnimation> = {
  render: (args) => <LoadingAnimation {...args} />,
  args: {},
  argTypes: {},
};
