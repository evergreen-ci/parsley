import styled from "@emotion/styled";
import { size } from "constants/tokens";
import { CustomMeta, CustomStoryObj } from "test_utils/types";
import { TaskStatus } from "types/task";
import TaskStatusBadge from ".";

export default {
  component: TaskStatusBadge,
} satisfies CustomMeta<typeof TaskStatusBadge>;

export const Default: CustomStoryObj<typeof TaskStatusBadge> = {
  render: (args) => <TaskStatusBadge {...args} />,
  args: {
    status: TaskStatus.Succeeded,
  },
  argTypes: {
    status: {
      options: TaskStatus,
      control: "select",
    },
  },
};

export const AllBadges: CustomStoryObj<typeof TaskStatusBadge> = {
  render: () => (
    <Container>
      {Object.values(TaskStatus).map((status) => (
        <TaskStatusBadge key={status} status={status} />
      ))}
    </Container>
  ),
};

const Container = styled.div`
  display: flex;
  gap: ${size.xs};
  flex-wrap: wrap;
`;
