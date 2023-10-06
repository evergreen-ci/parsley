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

interface UseResolveLogURLProps {
  buildID?: string;
  execution?: string;
  fileName?: string;
  groupID?: string;
  logType: string;
  origin?: string;
  taskID?: string;
  testID?: string;
}
type LogURLs = {
  /** The URL of the file parsley should download */
  downloadURL: string;
  /** The URL of the log file in the html log viewer */
  htmlLogURL: string;
  /** The URL of the RESMOKE logs job logs page in Spruce */
  jobLogsURL: string;
  /** The URL of the RESMOKE logs job logs page in logkeeper */
  legacyJobLogsURL: string;
  /** The URL to open the log in Lobster */
  lobsterURL: string;
  /** The URL of the log file without any processing */
  rawLogURL: string;
  /** Whether the hook is actively making an network request or not  */
  loading: boolean;
};

/**
 * `useResolveLogURL` is a custom hook that resolves the log URL based on the log type and other parameters.
 * @param UseResolveLogURLProps - The props for the hook
 * @param UseResolveLogURLProps.buildID - The build ID of the log
 * @param UseResolveLogURLProps.execution - The execution number of the log
 * @param UseResolveLogURLProps.fileName - The name of the file being viewed
 * @param UseResolveLogURLProps.groupID - The group ID of the test
 * @param UseResolveLogURLProps.logType - The type of log being viewed
 * @param UseResolveLogURLProps.origin - The origin of the log
 * @param UseResolveLogURLProps.taskID - The task ID of the log
 * @param UseResolveLogURLProps.testID - The test ID of the log
 * @returns LogURLs
 */
export const useResolveLogURL = ({
  buildID,
  execution,
  fileName,
  groupID,
  logType,
  origin,
  taskID,
  testID,
}: UseResolveLogURLProps): LogURLs => {
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
      downloadURL = getEvergreenTaskLogURL(taskID, execution, origin as any, {
        priority: true,
        text: true,
      });
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
