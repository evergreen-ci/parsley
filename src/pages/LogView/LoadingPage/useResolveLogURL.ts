import { useQuery } from "@apollo/client";
import { LogTypes } from "constants/enums";
import {
  getJobLogsURL,
  getLegacyJobLogsURL,
} from "constants/externalURLTemplates";
import {
  getEvergreenTaskFileURL,
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
  fileName?: string;
  groupID?: string;
  logType: string;
  origin?: string;
  taskID?: string;
  testID?: string;
}

export const useResolveLogURL = ({
  buildID,
  execution,
  fileName,
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
    skip: !(
      logType === LogTypes.EVERGREEN_TEST_LOGS &&
      taskID &&
      execution &&
      testID
    ),
    variables: {
      execution: parseInt(execution as string, 10),
      taskID: taskID as string,
      testName: `^${testID}$`,
    },
  });

  let rawLogURL = "";
  let htmlLogURL = "";
  let jobLogsURL = "";
  let legacyJobLogsURL = "";
  let lobsterURL = "";
  switch (logType) {
    case LogTypes.RESMOKE_LOGS: {
      if (buildID && testID) {
        rawLogURL = getResmokeLogURL(buildID, { raw: true, testID });
        htmlLogURL = getResmokeLogURL(buildID, { html: true, testID });
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
    case LogTypes.EVERGREEN_TASK_FILE: {
      if (taskID && execution && fileName) {
        // TODO: resolve this value using GQL https://jira.mongodb.org/browse/EVG-20809
        rawLogURL = getEvergreenTaskFileURL(taskID, execution, fileName);
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
      if (!taskID || !execution || !testID || isLoadingTest) {
        break;
      }
      const { url, urlLobster, urlRaw } =
        testData?.task?.tests.testResults[0]?.logs || {};
      rawLogURL =
        urlRaw ??
        getEvergreenTestLogURL(taskID, execution, testID, {
          groupID,
          text: true,
        });
      htmlLogURL =
        url ??
        getEvergreenTestLogURL(taskID, execution, testID, {
          groupID,
          text: false,
        });
      lobsterURL =
        urlLobster ?? getLobsterTestURL(taskID, execution, testID, groupID);
      break;
    }
    default:
      break;
  }
  return {
    htmlLogURL,
    jobLogsURL,
    legacyJobLogsURL,
    loading: isLoadingTest,
    lobsterURL,
    rawLogURL,
  };
};
