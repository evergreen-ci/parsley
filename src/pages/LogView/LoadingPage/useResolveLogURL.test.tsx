import { MockedProvider } from "@apollo/client/testing";
import { LogTypes } from "constants/enums";
import {
  TaskFilesQuery,
  TaskFilesQueryVariables,
  TaskQuery,
  TaskQueryVariables,
  TestLogUrlQuery,
  TestLogUrlQueryVariables,
} from "gql/generated/types";
import { GET_TASK, GET_TEST_LOG_URL, TASK_FILES } from "gql/queries";
import { renderHook, waitFor } from "test_utils";
import { ApolloMock } from "types/gql";
import { useResolveLogURL } from "./useResolveLogURL";

describe("useResolveLogURL", () => {
  it("resolves test log URLs from GraphQL resolver when data is available", async () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MockedProvider
        mocks={[
          evergreenTaskMock,
          evergreenTaskMock,
          getExistingTestLogURLMock,
        ]}
      >
        {children}
      </MockedProvider>
    );
    const { result } = renderHook(
      () =>
        useResolveLogURL({
          execution: "0",
          logType: "EVERGREEN_TEST_LOGS",
          taskID: "a-task-id",
          testID: "a-test-name",
        }),
      {
        wrapper,
      },
    );
    expect(result.current).toMatchObject({
      downloadURL: "",
      htmlLogURL: "",
      jobLogsURL: "",
      legacyJobLogsURL: "",
      loading: true,
      lobsterURL: "",
      rawLogURL: "",
    });
    await waitFor(() => {
      expect(result.current).toMatchObject({
        downloadURL: "rawURL",
        htmlLogURL: "htmlURL",
        jobLogsURL: "",
        legacyJobLogsURL: "",
        loading: false,
        lobsterURL: "lobsterURL",
        rawLogURL: "rawURL",
      });
    });
  });

  it("resolves task log URLs from GraphQL resolver when data is available", async () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MockedProvider
        mocks={[
          evergreenTaskMock,
          evergreenTaskMock,
          getExistingTestLogURLMock,
        ]}
      >
        {children}
      </MockedProvider>
    );
    const { result } = renderHook(
      () =>
        useResolveLogURL({
          execution: "0",
          logType: "EVERGREEN_TASK_LOGS",
          origin: "agent",
          taskID: "a-task-id",
        }),
      {
        wrapper,
      },
    );
    expect(result.current).toMatchObject({
      downloadURL: "",
      htmlLogURL: "",
      jobLogsURL: "",
      legacyJobLogsURL: "",
      loading: true,
      lobsterURL: "",
      rawLogURL: "",
    });
    await waitFor(() => {
      expect(result.current).toMatchObject({
        downloadURL: "agent-link.com?priority=true&text=true&type=E",
        htmlLogURL: "agent-link.com?text=false&type=E",
        jobLogsURL: "",
        legacyJobLogsURL: "",
        loading: false,
        lobsterURL: "test-lobster.com/evergreen/task/a-task-id/0/agent",
        rawLogURL: "agent-link.com?text=true&type=E",
      });
    });
  });

  it("generates test log URLs without GraphQL data when GraphQL data is empty", async () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MockedProvider
        mocks={[evergreenTaskMock, evergreenTaskMock, getEmptyTestLogURLMock]}
      >
        {children}
      </MockedProvider>
    );
    const { result } = renderHook(
      () =>
        useResolveLogURL({
          execution: "0",
          logType: "EVERGREEN_TEST_LOGS",
          taskID: "a-task-id",
          testID: "a-test-name-that-doesnt-exist",
        }),
      {
        wrapper,
      },
    );
    await waitFor(() => {
      expect(result.current).toMatchObject({
        downloadURL:
          "test-evergreen.com/test_log/a-task-id/0?test_name=a-test-name-that-doesnt-exist&text=true",
        htmlLogURL:
          "test-evergreen.com/test_log/a-task-id/0?test_name=a-test-name-that-doesnt-exist&text=false",
        jobLogsURL: "",
        legacyJobLogsURL: "",
        loading: false,
        lobsterURL:
          "test-lobster.com/evergreen/test/a-task-id/0/a-test-name-that-doesnt-exist",
        rawLogURL:
          "test-evergreen.com/test_log/a-task-id/0?test_name=a-test-name-that-doesnt-exist&text=true",
      });
    });
  });

  it("generates task file urls", async () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MockedProvider
        mocks={[evergreenTaskMock, evergreenTaskMock, getTaskFileURLMock]}
      >
        {children}
      </MockedProvider>
    );
    const { result } = renderHook(
      () =>
        useResolveLogURL({
          execution: "0",
          fileName: "a-file-name",
          logType: LogTypes.EVERGREEN_TASK_FILE,
          taskID: "a-task-id",
        }),
      {
        wrapper,
      },
    );
    await waitFor(() => {
      expect(result.current).toMatchObject({
        downloadURL: "test-evergreen.com/task_file_raw/a-task-id/0/a-file-name",
        htmlLogURL: "",
        jobLogsURL: "",
        legacyJobLogsURL: "",
        loading: false,
        lobsterURL: "",
        rawLogURL: "a-file-url",
      });
    });
  });

  it("generates task file urls that are properly encoded", async () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MockedProvider
        mocks={[evergreenTaskMock, evergreenTaskMock, getTaskFileURLMock]}
      >
        {children}
      </MockedProvider>
    );
    const { result } = renderHook(
      () =>
        useResolveLogURL({
          execution: "0",
          fileName: "a file name.some/crazy/path",
          logType: LogTypes.EVERGREEN_TASK_FILE,
          taskID: "a-task-id",
        }),
      {
        wrapper,
      },
    );
    await waitFor(() => {
      expect(result.current).toMatchObject({
        downloadURL:
          "test-evergreen.com/task_file_raw/a-task-id/0/a%20file%20name.some%2Fcrazy%2Fpath",
        htmlLogURL: "",
        jobLogsURL: "",
        legacyJobLogsURL: "",
        loading: false,
        lobsterURL: "",
        rawLogURL: "a-file-url-with-crazy-path",
      });
    });
  });
});

const getExistingTestLogURLMock: ApolloMock<
  TestLogUrlQuery,
  TestLogUrlQueryVariables
> = {
  request: {
    query: GET_TEST_LOG_URL,
    variables: {
      execution: 0,
      taskID: "a-task-id",
      testName: "^a-test-name$",
    },
  },
  result: {
    data: {
      task: {
        id: "taskID",
        tests: {
          testResults: [
            {
              id: "testID",
              logs: {
                url: "htmlURL",
                urlLobster: "lobsterURL",
                urlRaw: "rawURL",
              },
            },
          ],
        },
      },
    },
  },
};

const getEmptyTestLogURLMock: ApolloMock<
  TestLogUrlQuery,
  TestLogUrlQueryVariables
> = {
  request: {
    query: GET_TEST_LOG_URL,
    variables: {
      execution: 0,
      taskID: "a-task-id",
      testName: "^a-test-name-that-doesnt-exist$",
    },
  },
  result: {
    data: {
      task: {
        id: "taskID",
        tests: {
          testResults: [],
        },
      },
    },
  },
};

const getTaskFileURLMock: ApolloMock<TaskFilesQuery, TaskFilesQueryVariables> =
  {
    request: {
      query: TASK_FILES,
      variables: {
        execution: 0,
        taskId: "a-task-id",
      },
    },
    result: {
      data: {
        task: {
          execution: 0,
          files: {
            groupedFiles: [
              {
                execution: 0,
                files: [
                  {
                    link: "a-file-url",
                    name: "a-file-name",
                  },
                  {
                    link: "a-file-url-with-crazy-path",
                    name: "a file name.some/crazy/path",
                  },
                ],
                taskId: "a-task-id",
                taskName: "a-task-name",
              },
            ],
          },
          id: "taskID",
        },
      },
    },
  };

const evergreenTaskMock: ApolloMock<TaskQuery, TaskQueryVariables> = {
  request: {
    query: GET_TASK,
    variables: {
      execution: 0,
      taskId: "a-task-id",
    },
  },
  result: {
    data: {
      task: {
        __typename: "Task",
        displayName: "check_codegen",
        execution: 0,
        id: "a-task-id",
        logs: {
          agentLogLink: "agent-link.com?type=E",
          allLogLink: "all-log-link.com?type=ALL",
          systemLogLink: "system-log-link.com?type=S",
          taskLogLink: "task-log-link.com?type=T",
        },
        patchNumber: 1,
        status: "failed",
        versionMetadata: {
          __typename: "Version",
          id: "spruce_d54e2c6ede60e004c48d3c4d996c59579c7bbd1f",
          isPatch: false,
          message: "v2.28.5",
          projectIdentifier: "spruce",
          revision: "d54e2c6ede60e004c48d3c4d996c59579c7bbd1f",
        },
      },
    },
  },
};
