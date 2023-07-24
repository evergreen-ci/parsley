import styled from "@emotion/styled";
import { size } from "constants/tokens";
import { CustomMeta, CustomStoryObj } from "test_utils/types";
import { TestStatus } from "types/test";
import TestStatusBadge from ".";

export default {
  component: TestStatusBadge,
} satisfies CustomMeta<typeof TestStatusBadge>;

export const Default: CustomStoryObj<typeof TestStatusBadge> = {
  render: (args) => <TestStatusBadge {...args} />,
  args: {
    status: TestStatus.Pass,
  },
  argTypes: {
    status: {
      options: TestStatus,
      control: "select",
    },
  },
};

export const AllBadges: CustomStoryObj<typeof TestStatusBadge> = {
  render: () => (
    <Container>
      {Object.values(TestStatus).map((status) => (
        <TestStatusBadge key={status} status={status} />
      ))}
    </Container>
  ),
};

const Container = styled.div`
  display: flex;
  gap: ${size.xs};
  flex-wrap: wrap;
`;
