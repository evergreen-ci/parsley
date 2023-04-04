import styled from "@emotion/styled";
import { StoryObj } from "@storybook/react";
import { size } from "constants/tokens";
import { TaskStatus } from "types/task";
import TaskStatusBadge from ".";

export default {
  component: TaskStatusBadge,
};

export const Default: StoryObj<typeof TaskStatusBadge> = {
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

export const AllBadges: StoryObj<typeof TaskStatusBadge> = {
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
