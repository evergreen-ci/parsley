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
import {
  TaskFilesQuery,
  TaskFilesQueryVariables,
  TestLogUrlQuery,
  TestLogUrlQueryVariables,
} from "gql/generated/types";
import { GET_TEST_LOG_URL, TASK_FILES } from "gql/queries";

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

  const { data: taskFileData, loading: isLoadingTaskFileData } = useQuery<
    TaskFilesQuery,
    TaskFilesQueryVariables
  >(TASK_FILES, {
    skip: !(logType === LogTypes.EVERGREEN_TASK_FILE && taskID && execution),
    variables: {
      execution: parseInt(execution as string, 10),
      taskId: taskID as string,
    },
  });

  let downloadURL = "";
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
      downloadURL = rawLogURL;
      break;
    }
    case LogTypes.EVERGREEN_TASK_FILE: {
      if (!taskID || !execution || isLoadingTaskFileData) {
        break;
      }
      if (taskID && execution && fileName) {
        downloadURL = getEvergreenTaskFileURL(
          taskID,
          execution,
          encodeURIComponent(fileName)
        );
        const allFiles = taskFileData?.task?.files.groupedFiles.flatMap(
          (group) => group.files
        );
        rawLogURL =
          allFiles?.find((file) => file?.name === fileName)?.link || "";
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
      downloadURL = rawLogURL;
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
      downloadURL = rawLogURL;
      break;
    }
    default:
      break;
  }
  return {
    downloadURL,
    htmlLogURL,
    jobLogsURL,
    legacyJobLogsURL,
    loading: isLoadingTest,
    lobsterURL,
    rawLogURL,
  };
};
