import { MockedProvider } from "@apollo/client/testing";
import { renderHook } from "@testing-library/react-hooks";
import { LogTypes } from "constants/enums";
import {
  TaskFilesQuery,
  TaskFilesQueryVariables,
  TestLogUrlQuery,
  TestLogUrlQueryVariables,
} from "gql/generated/types";
import { GET_TEST_LOG_URL, TASK_FILES } from "gql/queries";
import { ApolloMock } from "types/gql";
import { useResolveLogURL } from "./useResolveLogURL";

describe("useResolveLogURL", () => {
  it("resolves test log URLs from GraphQL resolver when data is available", async () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MockedProvider mocks={[getExistingTestLogURLMock]}>
        {children}
      </MockedProvider>
    );
    const { result, waitForNextUpdate } = renderHook(
      () =>
        useResolveLogURL({
          execution: "0",
          logType: "EVERGREEN_TEST_LOGS",
          taskID: "a-task-id",
          testID: "a-test-name",
        }),
      {
        wrapper,
      }
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
    await waitForNextUpdate();
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

  it("generates test log URLs without GraphQL data when GraphQL data is empty", async () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MockedProvider mocks={[getEmptyTestLogURLMock]}>
        {children}
      </MockedProvider>
    );
    const { result, waitForNextUpdate } = renderHook(
      () =>
        useResolveLogURL({
          execution: "0",
          logType: "EVERGREEN_TEST_LOGS",
          taskID: "a-task-id",
          testID: "a-test-name-that-doesnt-exist",
        }),
      {
        wrapper,
      }
    );
    await waitForNextUpdate();
    expect(result.current).toMatchObject({
      downloadURL:
        "test-evergreen.com/test_log/a-task-id/0?test_name=a-test-name-that-doesnt-exist&text=true",
      htmlLogURL:
        "test-evergreen.com/test_log/a-task-id/0?test_name=a-test-name-that-doesnt-exist&text=false",
      jobLogsURL: "",
      legacyJobLogsURL: "",
      loading: false,
      lobsterURL:
        "undefined/evergreen/test/a-task-id/0/a-test-name-that-doesnt-exist",
      rawLogURL:
        "test-evergreen.com/test_log/a-task-id/0?test_name=a-test-name-that-doesnt-exist&text=true",
    });
  });

  it("generates task file urls", async () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MockedProvider mocks={[getTaskFileURLMock]}>{children}</MockedProvider>
    );
    const { result, waitForNextUpdate } = renderHook(
      () =>
        useResolveLogURL({
          execution: "0",
          fileName: "a-file-name",
          logType: LogTypes.EVERGREEN_TASK_FILE,
          taskID: "a-task-id",
        }),
      {
        wrapper,
      }
    );
    await waitForNextUpdate();
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
  it("generates task file urls that are properly encoded", async () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MockedProvider mocks={[getTaskFileURLMock]}>{children}</MockedProvider>
    );
    const { result, waitForNextUpdate } = renderHook(
      () =>
        useResolveLogURL({
          execution: "0",
          fileName: "a file name.some/crazy/path",
          logType: LogTypes.EVERGREEN_TASK_FILE,
          taskID: "a-task-id",
        }),
      {
        wrapper,
      }
    );
    await waitForNextUpdate();
    await waitForNextUpdate();
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
      testName: "^a-test-name$",
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
