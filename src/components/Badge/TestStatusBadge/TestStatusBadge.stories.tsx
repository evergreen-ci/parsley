import styled from "@emotion/styled";
import { StoryObj } from "@storybook/react";
import { size } from "constants/tokens";
import { TestStatus } from "types/test";
import TestStatusBadge from ".";

export default {
  component: TestStatusBadge,
};

export const Default: StoryObj<typeof TestStatusBadge> = {
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

export const AllBadges: StoryObj<typeof TestStatusBadge> = {
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
