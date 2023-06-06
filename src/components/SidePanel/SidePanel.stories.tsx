import { useEffect } from "react";
import { MockedProvider } from "@apollo/client/testing";
import styled from "@emotion/styled";
import { actions } from "@storybook/addon-actions";
import { StoryObj } from "@storybook/react";
import { userEvent } from "@storybook/testing-library";
import { LogTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import { TaskQuery, TaskQueryVariables } from "gql/generated/types";
import { cache } from "gql/GQLProvider";
import { GET_TASK } from "gql/queries";
import { useQueryParams } from "hooks/useQueryParam";
import { defaultFiltersMock } from "test_data/defaultFilters";
import SidePanel from ".";

export default {
  component: SidePanel,
  decorators: [
    (Story: () => JSX.Element) => (
      <MockedProvider mocks={[defaultFiltersMock]}>
        <Story />
      </MockedProvider>
    ),
  ],
};
const Story = ({ ...args }) => {
  const [, setSearchParams] = useQueryParams();
  const { setLogMetadata } = useLogContext();

  useEffect(() => {
    cache.writeQuery<TaskQuery, TaskQueryVariables>({
      query: GET_TASK,
      variables: {
        taskId: "evergreen_task",
        execution: 0,
      },
      data: {
        ...taskQuery,
      },
    });
    setSearchParams({
      highlights: ["highlight", "highlight2"],
      filters: ["100active%20filter"],
    });
    setLogMetadata({
      taskID: "evergreen_task",
      execution: "0",
      logType: LogTypes.EVERGREEN_TASK_LOGS,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const clearExpandedLines = () => actions("clearExpandedLines");
  const collapseLines = () => actions("collapseLines");
  return (
    <Container>
      <SidePanel
        {...args}
        clearExpandedLines={clearExpandedLines}
        collapseLines={collapseLines}
        expandedLines={[[1, 10]]}
      />
    </Container>
  );
};
export const Default: StoryObj<typeof SidePanel> = {
  render: (args) => <Story {...args} />,
  play: () => {
    userEvent.keyboard("[[");
  },
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 600px;
`;

const taskQuery: TaskQuery = {
  task: {
    __typename: "Task",
    displayName: "test",
    execution: 0,
    id: "evergreen_task",
    patchNumber: 1239,
    status: "success",
    versionMetadata: {
      __typename: "Version",
      id: "evergreen_1234",
      isPatch: false,
      message: "EVG-1234: Add loading state",
      projectIdentifier: "evergreen",
      revision: "1234",
    },
  },
};
