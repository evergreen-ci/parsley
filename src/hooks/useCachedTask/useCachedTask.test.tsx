import { InMemoryCache } from "@apollo/client";
import { MockedProvider } from "@apollo/client/testing";
import { act, renderHook } from "@testing-library/react-hooks";
import { MemoryRouter } from "react-router-dom";
import { LogTypes } from "constants/enums";
import { LogContextProvider, useLogContext } from "context/LogContext";
import {
  LogkeeperTaskQuery,
  LogkeeperTaskQueryVariables,
  Task,
  TaskQuery,
  TaskQueryVariables,
} from "gql/generated/types";
import { GET_LOGKEEPER_TASK, GET_TASK } from "gql/queries";
import { useCachedTask } from ".";

const cache = new InMemoryCache({});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MockedProvider cache={cache}>
    <MemoryRouter initialEntries={["/"]}>
      <LogContextProvider initialLogLines={[]}>{children}</LogContextProvider>
    </MemoryRouter>
  </MockedProvider>
);

const useJointHook = () => {
  const { setLogMetadata } = useLogContext();
  const task = useCachedTask();
  return { task, setLogMetadata };
};

describe("useCachedTask", () => {
  it("should be able to read from the cache for task logs", async () => {
    cache.writeQuery<TaskQuery, TaskQueryVariables>({
      query: GET_TASK,
      variables: {
        taskId: "spruce_ubuntu1604_test_1234",
        execution: 0,
      },
      data: {
        ...taskQuery,
      },
    });

    const { result, rerender } = renderHook(() => useJointHook(), {
      wrapper,
    });
    act(() => {
      result.current.setLogMetadata({
        taskID: "spruce_ubuntu1604_test_1234",
        execution: "0",
        logType: LogTypes.EVERGREEN_TASK_LOGS,
      });
    });
    rerender();
    expect(result.current.task).toMatchObject(taskQuery?.task as Task);
  });

  it("should be able to read from the cache for resmoke logs", async () => {
    cache.writeQuery<LogkeeperTaskQuery, LogkeeperTaskQueryVariables>({
      query: GET_LOGKEEPER_TASK,
      variables: {
        buildId: "7e208050e166b1a9025c817b67eee48d",
      },
      data: {
        ...logkeeperTaskQuery,
      },
    });

    const { result, rerender } = renderHook(() => useJointHook(), {
      wrapper,
    });
    act(() => {
      result.current.setLogMetadata({
        buildID: "7e208050e166b1a9025c817b67eee48d",
        logType: LogTypes.RESMOKE_LOGS,
      });
    });
    rerender();
    expect(result.current.task).toMatchObject(
      logkeeperTaskQuery?.logkeeperBuildMetadata?.task as Task
    );
  });
});

const taskQuery: TaskQuery = {
  task: {
    __typename: "Task",
    displayName: "test",
    execution: 0,
    id: "spruce_ubuntu1604_test_1234",
    patchNumber: 1239,
    status: "success",
    versionMetadata: {
      __typename: "Version",
      id: "spruce_1234",
      isPatch: false,
      message: "EVG-1234: Add loading state",
      projectIdentifier: "spruce",
      revision: "1234",
    },
  },
};

const logkeeperTaskQuery: LogkeeperTaskQuery = {
  logkeeperBuildMetadata: {
    __typename: "LogkeeperBuild",
    id: "7e208050e166b1a9025c817b67eee48d",
    task: {
      __typename: "Task",
      tests: {
        __typename: "TaskTestResult",
        testResults: [],
      },
      displayName: "merge-patch",
      execution: 0,
      id: "mongodb_mongo_master_6789",
      patchNumber: 973,
      status: "success",
      versionMetadata: {
        __typename: "Version",
        id: "mongo_6789",
        isPatch: true,
        message: "SERVER-6789 Create tests",
        projectIdentifier: "mongodb-mongo-master",
        revision: "6789",
      },
    },
  },
};
