import { MockedProvider } from "@apollo/client/testing";
import { LogTypes } from "constants/enums";
import {
  TaskFilesQuery,
  TaskFilesQueryVariables,
  TaskQuery,
  TaskQueryVariables,
  TestLogUrlAndRenderingTypeQuery,
  TestLogUrlAndRenderingTypeQueryVariables,
} from "gql/generated/types";
import {
  GET_TASK,
  GET_TEST_LOG_URL_AND_RENDERING_TYPE,
  TASK_FILES,
} from "gql/queries";
import { renderHook, waitFor } from "test_utils";
import { ApolloMock } from "types/gql";
import * as ErrorReporting from "utils/errorReporting";
import { useResolveLogURLAndRenderingType } from "./useResolveLogURLAndRenderingType";

describe("useResolveLogURLAndRenderingType", () => {
  describe("test log renderingType", () => {
    const hookParams = {
      execution: "0",
      logType: "EVERGREEN_TEST_LOGS",
      taskID: "a-task-id",
      testID: "a-test-name",
    };
    beforeEach(() => {
      jest.spyOn(ErrorReporting, "reportError");
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });
    it("resolves test log renderingType from GraphQL resolver when API value is 'resmoke'", async () => {
      const wrapper: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => (
        <MockedProvider
          mocks={[
            evergreenTaskMock,
            evergreenTaskMock,
            getExistingResmokeTestLogURLMock,
          ]}
        >
          {children}
        </MockedProvider>
      );
      const { result } = renderHook(
        () => useResolveLogURLAndRenderingType(hookParams),
        {
          wrapper,
        },
      );
      await waitFor(() => {
        expect(result.current).toMatchObject({
          loading: true,
          renderingType: "default",
        });
      });
      await waitFor(() => {
        expect(result.current).toMatchObject({
          loading: false,
          renderingType: "resmoke",
        });
      });
      await waitFor(() => {
        expect(ErrorReporting.reportError).not.toHaveBeenCalled();
      });
    });
    it("resolves test log renderingType from GraphQL resolver when API value is 'default'", async () => {
      const wrapper: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => (
        <MockedProvider
          mocks={[
            evergreenTaskMock,
            evergreenTaskMock,
            getExistingDefaultTestLogURLMock,
          ]}
        >
          {children}
        </MockedProvider>
      );
      const { result } = renderHook(
        () => useResolveLogURLAndRenderingType(hookParams),
        {
          wrapper,
        },
      );
      await waitFor(() => {
        expect(result.current).toMatchObject({
          loading: true,
          renderingType: "default",
        });
      });
      await waitFor(() => {
        expect(result.current).toMatchObject({
          loading: false,
          renderingType: "default",
        });
      });
      await waitFor(() => {
        expect(ErrorReporting.reportError).not.toHaveBeenCalled();
      });
    });
    it("resolves task log renderingType from GraphQL resolver when API value is empty", async () => {
      const wrapper: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => (
        <MockedProvider
          mocks={[
            evergreenTaskMock,
            evergreenTaskMock,
            getExistingDefaultTestLogURLMockEmptyRenderingType,
          ]}
        >
          {children}
        </MockedProvider>
      );
      const { result } = renderHook(
        () => useResolveLogURLAndRenderingType(hookParams),
        {
          wrapper,
        },
      );
      await waitFor(() => {
        expect(result.current).toMatchObject({
          loading: true,
          renderingType: "default",
        });
      });

      await waitFor(() => {
        expect(result.current).toMatchObject({
          loading: false,
          renderingType: "default",
        });
      });
      await waitFor(() => {
        expect(ErrorReporting.reportError).not.toHaveBeenCalled();
      });
    });
    it("resolves test log renderingType to 'default' and reports error when API value is not recognized", async () => {
      const wrapper: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => (
        <MockedProvider
          mocks={[
            evergreenTaskMock,
            evergreenTaskMock,
            getExistingTestLogURLInvalidRenderingTypeMock,
          ]}
        >
          {children}
        </MockedProvider>
      );
      const { result } = renderHook(
        () => useResolveLogURLAndRenderingType(hookParams),
        {
          wrapper,
        },
      );
      await waitFor(() => {
        expect(result.current).toMatchObject({
          loading: true,
          renderingType: "default",
        });
      });
      await waitFor(() => {
        expect(result.current).toMatchObject({
          loading: false,
          renderingType: "default",
        });
      });
      await waitFor(() => {
        expect(ErrorReporting.reportError).toHaveBeenCalledTimes(1);
        // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
        expect(ErrorReporting.reportError).toHaveBeenCalledWith(
          new Error("Encountered unsupported renderingType"),
          {
            context: {
              rawLogURL: "rawURL",
              unsupportedRenderingType: "not-a-valid-rendering-type",
            },
          },
        );
      });
    });
  });

  it("resolves test log URLs from GraphQL resolver when data is available", async () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MockedProvider
        mocks={[
          evergreenTaskMock,
          evergreenTaskMock,
          getExistingResmokeTestLogURLMock,
        ]}
      >
        {children}
      </MockedProvider>
    );
    const { result } = renderHook(
      () =>
        useResolveLogURLAndRenderingType({
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
      rawLogURL: "",
    });
    await waitFor(() => {
      expect(result.current).toMatchObject({
        downloadURL: "rawURL",
        htmlLogURL: "htmlURL",
        jobLogsURL: "",
        legacyJobLogsURL: "",
        loading: false,
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
          getExistingResmokeTestLogURLMock,
        ]}
      >
        {children}
      </MockedProvider>
    );
    const { result } = renderHook(
      () =>
        useResolveLogURLAndRenderingType({
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
      rawLogURL: "",
    });
    await waitFor(() => {
      expect(result.current).toMatchObject({
        downloadURL: "agent-link.com?priority=true&text=true&type=E",
        htmlLogURL: "agent-link.com?text=false&type=E",
        jobLogsURL: "",
        legacyJobLogsURL: "",
        loading: false,
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
        useResolveLogURLAndRenderingType({
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
        useResolveLogURLAndRenderingType({
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
        useResolveLogURLAndRenderingType({
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
        rawLogURL: "a-file-url-with-crazy-path",
      });
    });
  });
});

const getExistingResmokeTestLogURLMock: ApolloMock<
  TestLogUrlAndRenderingTypeQuery,
  TestLogUrlAndRenderingTypeQueryVariables
> = {
  request: {
    query: GET_TEST_LOG_URL_AND_RENDERING_TYPE,
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
                renderingType: "resmoke",
                url: "htmlURL",
                urlRaw: "rawURL",
              },
            },
          ],
        },
      },
    },
  },
};

const getExistingTestLogURLInvalidRenderingTypeMock: ApolloMock<
  TestLogUrlAndRenderingTypeQuery,
  TestLogUrlAndRenderingTypeQueryVariables
> = {
  request: {
    query: GET_TEST_LOG_URL_AND_RENDERING_TYPE,
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
                renderingType: "not-a-valid-rendering-type",
                url: "htmlURL",
                urlRaw: "rawURL",
              },
            },
          ],
        },
      },
    },
  },
};

const getExistingDefaultTestLogURLMock: ApolloMock<
  TestLogUrlAndRenderingTypeQuery,
  TestLogUrlAndRenderingTypeQueryVariables
> = {
  request: {
    query: GET_TEST_LOG_URL_AND_RENDERING_TYPE,
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
                renderingType: "default",
                url: "htmlURL",
                urlRaw: "rawURL",
              },
            },
          ],
        },
      },
    },
  },
};

const getExistingDefaultTestLogURLMockEmptyRenderingType: ApolloMock<
  TestLogUrlAndRenderingTypeQuery,
  TestLogUrlAndRenderingTypeQueryVariables
> = {
  request: {
    query: GET_TEST_LOG_URL_AND_RENDERING_TYPE,
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
                renderingType: null,
                url: "htmlURL",
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
  TestLogUrlAndRenderingTypeQuery,
  TestLogUrlAndRenderingTypeQueryVariables
> = {
  request: {
    query: GET_TEST_LOG_URL_AND_RENDERING_TYPE,
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
