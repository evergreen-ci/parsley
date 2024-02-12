import { useQuery } from "@apollo/client";
import { LogTypes } from "constants/enums";
import {
  getJobLogsURL,
  getLegacyJobLogsURL,
} from "constants/externalURLTemplates";
import {
  constructEvergreenTaskLogURL,
  getEvergreenTaskFileURL,
  getEvergreenTaskLogURL,
  getEvergreenTestLogURL,
  getResmokeLogURL,
} from "constants/logURLTemplates";
import {
  TaskFilesQuery,
  TaskFilesQueryVariables,
  TestLogUrlAndRenderingTypeQuery,
  TestLogUrlAndRenderingTypeQueryVariables,
} from "gql/generated/types";
import { GET_TEST_LOG_URL_AND_RENDERING_TYPE, TASK_FILES } from "gql/queries";
import { useTaskQuery } from "hooks/useTaskQuery";

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
export const useResolveLogURLAndRenderingType = ({
  buildID,
  execution,
  fileName,
  groupID,
  logType,
  origin,
  taskID,
  testID,
}: UseResolveLogURLProps): LogURLs => {
  const { loading: isLoadingTask, task } = useTaskQuery({
    buildID,
    execution,
    logType: logType as LogTypes,
    taskID,
  });

  const { data: testData, loading: isLoadingTest } = useQuery<
    TestLogUrlAndRenderingTypeQuery,
    TestLogUrlAndRenderingTypeQueryVariables
  >(GET_TEST_LOG_URL_AND_RENDERING_TYPE, {
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
  switch (logType) {
    case LogTypes.RESMOKE_LOGS: {
      if (buildID && testID) {
        rawLogURL = getResmokeLogURL(buildID, { raw: true, testID });
        htmlLogURL = getResmokeLogURL(buildID, { html: true, testID });
      } else if (buildID) {
        rawLogURL = getResmokeLogURL(buildID, { raw: true });
        htmlLogURL = getResmokeLogURL(buildID, { html: true });
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
          encodeURIComponent(fileName),
        );
        const allFiles = taskFileData?.task?.files.groupedFiles.flatMap(
          (group) => group.files,
        );
        rawLogURL =
          allFiles?.find((file) => file?.name === fileName)?.link || "";
      }
      break;
    }
    case LogTypes.EVERGREEN_TASK_LOGS: {
      if (!taskID || !origin || !execution || isLoadingTask) {
        break;
      }
      downloadURL = task?.logs
        ? getEvergreenTaskLogURL(task.logs, origin, {
            priority: true,
            text: true,
          })
        : constructEvergreenTaskLogURL(taskID, execution, origin, {
            priority: true,
            text: true,
          });
      rawLogURL = task?.logs
        ? getEvergreenTaskLogURL(task.logs, origin, {
            text: true,
          })
        : constructEvergreenTaskLogURL(taskID, execution, origin, {
            text: true,
          });
      htmlLogURL = task?.logs
        ? getEvergreenTaskLogURL(task.logs, origin, {
            text: false,
          })
        : constructEvergreenTaskLogURL(taskID, execution, origin, {
            text: false,
          });
      break;
    }
    case LogTypes.EVERGREEN_TEST_LOGS: {
      if (!taskID || !execution || !testID || isLoadingTest) {
        break;
      }
      const { url, urlRaw } = testData?.task?.tests.testResults[0]?.logs || {};
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
    loading: isLoadingTest || isLoadingTask || isLoadingTaskFileData,
    rawLogURL,
  };
};
