import { useEffect, useState } from "react";
import { InMemoryCache } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import { StoryObj } from "@storybook/react";
import { LogTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import { TaskQuery, TaskQueryVariables } from "gql/generated/types";
import { GET_TASK } from "gql/queries";
import { useQueryParams } from "hooks/useQueryParam";
import { defaultFiltersMock, noFiltersMock } from "test_data/defaultFilters";
import ApplyFiltersModal from ".";

const cache = new InMemoryCache({});

export default {
  component: ApplyFiltersModal,
};

const Component = ({ ...args }) => {
  const [, setSearchParams] = useQueryParams();
  const { setLogMetadata } = useLogContext();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    cache.reset();
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
    setSearchParams({ filters: ["100active%20filter"] });
    setLogMetadata({
      taskID: "evergreen_task",
      execution: "0",
      logType: LogTypes.EVERGREEN_TASK_LOGS,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <button onClick={() => setOpen(true)} type="button">
        Open modal
      </button>
      <ApplyFiltersModal {...args} open={open} setOpen={setOpen} />
    </>
  );
};

export const Default: StoryObj<typeof ApplyFiltersModal> = {
  render: (args) => <Component {...args} />,
  decorators: [
    (Story: () => JSX.Element) => (
      <MockedProvider cache={cache} mocks={[defaultFiltersMock]}>
        <Story />
      </MockedProvider>
    ),
  ],
};

export const Empty: StoryObj<typeof ApplyFiltersModal> = {
  render: (args) => <Component {...args} />,
  decorators: [
    (Story: () => JSX.Element) => (
      <MockedProvider cache={cache} mocks={[noFiltersMock]}>
        <Story />
      </MockedProvider>
    ),
  ],
};

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
