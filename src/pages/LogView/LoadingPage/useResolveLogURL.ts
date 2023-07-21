import { useQuery } from "@apollo/client";
import { LogTypes } from "constants/enums";
import {
  getJobLogsURL,
  getLegacyJobLogsURL,
} from "constants/externalURLTemplates";
import {
  getEvergreenTaskLogURL,
  getEvergreenTestLogURL,
  getLobsterResmokeURL,
  getLobsterTaskURL,
  getLobsterTestURL,
  getResmokeLogURL,
} from "constants/logURLTemplates";
import { TestLogUrlQuery, TestLogUrlQueryVariables } from "gql/generated/types";
import { GET_TEST_LOG_URL } from "gql/queries";

interface Props {
  buildID?: string;
  execution?: string;
  groupID?: string;
  logType: string;
  origin?: string;
  taskID?: string;
  testID?: string;
}

export const useResolveLogURL = ({
  buildID,
  execution,
  groupID,
  logType,
  origin,
  taskID,
  testID,
}: Props) => {
  const { data: testData, loading: isLoadingTest } = useQuery<
    TestLogUrlQuery,
    TestLogUrlQueryVariables
  >(GET_TEST_LOG_URL, {
    variables: {
      testName: `^${testID}$`,
      taskID: taskID as string,
      execution: parseInt(execution as string, 10),
    },
    skip: !(
      logType === LogTypes.EVERGREEN_TEST_LOGS &&
      taskID &&
      execution &&
      testID
    ),
  });
  let rawLogURL = "";
  let htmlLogURL = "";
  let jobLogsURL = "";
  let legacyJobLogsURL = "";
  let lobsterURL = "";
  switch (logType) {
    case LogTypes.RESMOKE_LOGS: {
      if (buildID && testID) {
        rawLogURL = getResmokeLogURL(buildID, { testID, raw: true });
        htmlLogURL = getResmokeLogURL(buildID, { testID, html: true });
        lobsterURL = getLobsterResmokeURL(buildID, testID);
      } else if (buildID) {
        rawLogURL = getResmokeLogURL(buildID, { raw: true });
        htmlLogURL = getResmokeLogURL(buildID, { html: true });
        lobsterURL = getLobsterResmokeURL(buildID);
      }
      if (buildID) {
        jobLogsURL = getJobLogsURL(buildID);
        legacyJobLogsURL = getLegacyJobLogsURL(buildID);
      }
      break;
    }
    case LogTypes.EVERGREEN_TASK_LOGS: {
      if (!taskID || !execution || !origin) {
        break;
      }
      rawLogURL = getEvergreenTaskLogURL(taskID, execution, origin as any, {
        text: true,
      });
      htmlLogURL = getEvergreenTaskLogURL(taskID, execution, origin as any, {
        text: false,
      });
      lobsterURL = getLobsterTaskURL(taskID, execution, origin);
      break;
    }
    case LogTypes.EVERGREEN_TEST_LOGS: {
      console.log(taskID, execution, testID, isLoadingTest);
      if (!taskID || !execution || !testID || isLoadingTest) {
        break;
      }
      const { url, urlLobster, urlRaw } =
        testData?.task?.tests.testResults[0]?.logs || {};
      rawLogURL =
        urlRaw ??
        getEvergreenTestLogURL(taskID, execution, testID, {
          text: true,
          groupID,
        });
      htmlLogURL =
        url ??
        getEvergreenTestLogURL(taskID, execution, testID, {
          text: false,
          groupID,
        });
      lobsterURL =
        urlLobster ?? getLobsterTestURL(taskID, execution, testID, groupID);
      break;
    }
    default:
      break;
  }
  return {
    rawLogURL,
    htmlLogURL,
    jobLogsURL,
    legacyJobLogsURL,
    lobsterURL,
    loading: isLoadingTest,
  };
};
