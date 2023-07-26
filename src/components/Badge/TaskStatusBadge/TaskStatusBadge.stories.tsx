import styled from "@emotion/styled";
import { size } from "constants/tokens";
import { CustomMeta, CustomStoryObj } from "test_utils/types";
import { TaskStatus } from "types/task";
import TaskStatusBadge from ".";

export default {
  component: TaskStatusBadge,
} satisfies CustomMeta<typeof TaskStatusBadge>;

export const Default: CustomStoryObj<typeof TaskStatusBadge> = {
  argTypes: {
    status: {
      control: "select",
      options: TaskStatus,
    },
  },
  args: {
    status: TaskStatus.Succeeded,
  },
  render: (args) => <TaskStatusBadge {...args} />,
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
