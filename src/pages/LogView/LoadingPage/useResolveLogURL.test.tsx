import { MockedProvider } from "@apollo/client/testing";
import { renderHook } from "@testing-library/react-hooks";
import { TestLogUrlQuery, TestLogUrlQueryVariables } from "gql/generated/types";
import { GET_TEST_LOG_URL } from "gql/queries";
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
          logType: "EVERGREEN_TEST_LOGS",
          taskID: "a-task-id",
          testID: "a-test-name",
          execution: "0",
        }),
      {
        wrapper,
      }
    );
    expect(result.current).toMatchObject({
      rawLogURL: "",
      htmlLogURL: "",
      jobLogsURL: "",
      legacyJobLogsURL: "",
      lobsterURL: "",
      loading: true,
    });
    await waitForNextUpdate();
    expect(result.current).toMatchObject({
      rawLogURL: "rawURL",
      htmlLogURL: "htmlURL",
      jobLogsURL: "",
      legacyJobLogsURL: "",
      lobsterURL: "lobsterURL",
      loading: false,
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
          logType: "EVERGREEN_TEST_LOGS",
          taskID: "a-task-id",
          testID: "a-test-name-that-doesnt-exist",
          execution: "0",
        }),
      {
        wrapper,
      }
    );
    await waitForNextUpdate();
    expect(result.current).toMatchObject({
      rawLogURL:
        "test-evergreen.com/test_log/a-task-id/0?test_name=a-test-name-that-doesnt-exist&text=true",
      htmlLogURL:
        "test-evergreen.com/test_log/a-task-id/0?test_name=a-test-name-that-doesnt-exist&text=false",
      jobLogsURL: "",
      legacyJobLogsURL: "",
      lobsterURL:
        "undefined/evergreen/test/a-task-id/0/a-test-name-that-doesnt-exist",
      loading: false,
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
      testName: "^a-test-name$",
      taskID: "a-task-id",
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
                urlRaw: "rawURL",
                urlLobster: "lobsterURL",
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
      testName: "^a-test-name$",
      taskID: "a-task-id",
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
