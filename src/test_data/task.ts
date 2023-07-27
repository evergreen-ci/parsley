import {
  LogkeeperTaskQuery,
  LogkeeperTaskQueryVariables,
  TaskQuery,
  TaskQueryVariables,
} from "gql/generated/types";
import { GET_LOGKEEPER_TASK, GET_TASK } from "gql/queries";
import { ApolloMock } from "types/gql";

export const evergreenTaskMock: ApolloMock<TaskQuery, TaskQueryVariables> = {
  request: {
    query: GET_TASK,
    variables: {
      execution: 0,
      taskId:
        "spruce_ubuntu1604_check_codegen_d54e2c6ede60e004c48d3c4d996c59579c7bbd1f_22_03_02_15_41_35",
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

export const logkeeperMetadataMock: ApolloMock<
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
