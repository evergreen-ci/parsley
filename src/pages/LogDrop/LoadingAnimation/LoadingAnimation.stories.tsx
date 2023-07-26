import { CustomMeta, CustomStoryObj } from "test_utils/types";
import LoadingAnimation from ".";

export default {
  component: LoadingAnimation,
} satisfies CustomMeta<typeof LoadingAnimation>;

export const Default: CustomStoryObj<typeof LoadingAnimation> = {
  argTypes: {},
  args: {},
  render: (args) => <LoadingAnimation {...args} />,
};
