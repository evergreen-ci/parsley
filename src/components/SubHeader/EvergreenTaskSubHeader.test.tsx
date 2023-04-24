import { MockedProvider } from "@apollo/client/testing";
import { LogTypes } from "constants/enums";
import {
  LogkeeperTaskQuery,
  LogkeeperTaskQueryVariables,
  TaskQuery,
  TaskQueryVariables,
} from "gql/generated/types";
import { GET_LOGKEEPER_TASK, GET_TASK } from "gql/queries";
import { render, screen, waitFor } from "test_utils";
import { ApolloMock } from "types/gql";
import { EvergreenTaskSubHeader } from "./EvergreenTaskSubHeader";

describe("evergreen task subheader", () => {
  it("should render task and test statuses for evergreen test log", async () => {
    render(
      <MockedProvider mocks={[evergreenTaskMock]}>
        <EvergreenTaskSubHeader
          buildID=""
          execution={0}
          logType={LogTypes.EVERGREEN_TEST_LOGS}
          taskID="spruce_ubuntu1604_check_codegen_d54e2c6ede60e004c48d3c4d996c59579c7bbd1f_22_03_02_15_41_35"
          testID="JustAFakeTestInALonelyWorld"
        />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("spruce")).toBeInTheDocument();
    });
    // check_codegen task should be failing
    expect(screen.getByText("check_codegen")).toBeInTheDocument();
    expect(screen.getByDataCy("task-status-badge").textContent).toContain(
      "Failed"
    );
    // JustAFakeTestInALonelyWorld test should be failing
    expect(screen.getByText("JustAFakeTestInALonelyWorld")).toBeInTheDocument();
    expect(screen.getByDataCy("test-status-badge").textContent).toContain(
      "Fail"
    );
  });

  it("should render task and test statuses for resmoke test log", async () => {
    render(
      <MockedProvider mocks={[logkeeperMetadataMock]}>
        <EvergreenTaskSubHeader
          buildID="7e208050e166b1a9025c817b67eee48d"
          execution={0}
          logType={LogTypes.RESMOKE_LOGS}
          taskID="mongodb_mongo_master_rhel80_debug_v4ubsan_all_feature_flags_experimental_concurrency_sharded_with_stepdowns_and_balancer_4_linux_enterprise_361789ed8a613a2dc0335a821ead0ab6205fbdaa_22_09_21_02_53_24"
          testID="1716e11b4f8a4541c5e2faf70affbfab"
        />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("mongodb-mongo-master")).toBeInTheDocument();
    });
    // merge-patch task should be succeeding
    expect(screen.getByText("merge-patch")).toBeInTheDocument();
    expect(screen.getByDataCy("task-status-badge").textContent).toContain(
      "Succeeded"
    );
    // ResmokeTest test should be passing
    expect(screen.getByText("ResmokeTest")).toBeInTheDocument();
    expect(screen.getByDataCy("test-status-badge").textContent).toContain(
      "Pass"
    );
  });
});

const evergreenTaskMock: ApolloMock<TaskQuery, TaskQueryVariables> = {
  request: {
    query: GET_TASK,
    variables: {
      taskId:
        "spruce_ubuntu1604_check_codegen_d54e2c6ede60e004c48d3c4d996c59579c7bbd1f_22_03_02_15_41_35",
      execution: 0,
    },
  },
  result: {
    data: {
      task: {
        __typename: "Task",
        displayName: "check_codegen",
        execution: 0,
        id: "spruce_ubuntu1604_check_codegen_d54e2c6ede60e004c48d3c4d996c59579c7bbd1f_22_03_02_15_41_35",
        patchNumber: 1236,
        status: "failed",
        tests: {
          __typename: "TaskTestResult",
          testResults: [
            {
              __typename: "TestResult",
              id: "JustAFakeTestInALonelyWorld",
              logs: {
                __typename: "TestLog",
                urlRaw:
                  "http://localhost:9090/test_log/spruce_ubuntu1604_check_codegen_d54e2c6ede60e004c48d3c4d996c59579c7bbd1f_22_03_02_15_41_35/0?test_name=JustAFakeTestInALonelyWorld&group_id=&text=true",
              },
              status: "fail",
              testFile: "JustAFakeTestInALonelyWorld",
            },
          ],
        },
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

const logkeeperMetadataMock: ApolloMock<
  LogkeeperTaskQuery,
  LogkeeperTaskQueryVariables
> = {
  request: {
    query: GET_LOGKEEPER_TASK,
    variables: {
      buildId: "7e208050e166b1a9025c817b67eee48d",
    },
  },
  result: {
    data: {
      logkeeperBuildMetadata: {
        __typename: "LogkeeperBuild",
        id: "7e208050e166b1a9025c817b67eee48d",
        task: {
          __typename: "Task",
          displayName: "merge-patch",
          execution: 0,
          id: "mongodb_mongo_master_rhel80_debug_v4ubsan_all_feature_flags_experimental_concurrency_sharded_with_stepdowns_and_balancer_4_linux_enterprise_361789ed8a613a2dc0335a821ead0ab6205fbdaa_22_09_21_02_53_24",
          patchNumber: 973,
          status: "success",
          tests: {
            __typename: "TaskTestResult",
            testResults: [
              {
                __typename: "TestResult",
                id: "resmoke-test-id",
                logs: {
                  __typename: "TestLog",
                  urlRaw:
                    "http://localhost:9090/build/7e208050e166b1a9025c817b67eee48d/test/1716e11b4f8a4541c5e2faf70affbfab?raw=true",
                },
                status: "pass",
                testFile: "ResmokeTest",
              },
            ],
          },
          versionMetadata: {
            __typename: "Version",
            id: "5e94c2dfe3c3312519b59480",
            isPatch: true,
            message: "SERVER-45720 Create tests for Atlas Workflows",
            projectIdentifier: "mongodb-mongo-master",
            revision: "977e984bf4ed5a406da11af800c12356d0975502",
          },
        },
      },
    },
  },
};
