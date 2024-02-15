import { useQuery } from "@apollo/client";
import { LogTypes, SupportedLogRenderingTypes } from "constants/enums";
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

interface UseResolveLogURLAndRenderingTypeProps {
  buildID?: string;
  execution?: string;
  fileName?: string;
  groupID?: string;
  logType: string;
  origin?: string;
  taskID?: string;
  testID?: string;
}

type HookResult = {
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
  /** The rendering logic to use for the log when available */
  renderingType: string;
};

/**
 * `useResolveLogURL` is a custom hook that resolves the log URL based on the log type and other parameters.
 * @param UseResolveLogURLAndRenderingTypeProps - The props for the hook
 * @param UseResolveLogURLAndRenderingTypeProps.buildID - The build ID of the log
 * @param UseResolveLogURLAndRenderingTypeProps.execution - The execution number of the log
 * @param UseResolveLogURLAndRenderingTypeProps.fileName - The name of the file being viewed
 * @param UseResolveLogURLAndRenderingTypeProps.groupID - The group ID of the test
 * @param UseResolveLogURLAndRenderingTypeProps.logType - The type of log being viewed
 * @param UseResolveLogURLAndRenderingTypeProps.origin - The origin of the log
 * @param UseResolveLogURLAndRenderingTypeProps.taskID - The task ID of the log
 * @param UseResolveLogURLAndRenderingTypeProps.testID - The test ID of the log
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
}: UseResolveLogURLAndRenderingTypeProps): HookResult => {
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
  let renderingType = "";
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
      renderingType = SupportedLogRenderingTypes.Resmoke;
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
      renderingType = SupportedLogRenderingTypes.Default;
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
      renderingType = SupportedLogRenderingTypes.Default;
      break;
    }
    case LogTypes.EVERGREEN_TEST_LOGS: {
      if (!taskID || !execution || !testID || isLoadingTest) {
        break;
      }
      const {
        renderingType: renderingTypeFromQuery,
        url,
        urlRaw,
      } = testData?.task?.tests.testResults[0]?.logs || {};
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
      renderingType =
        renderingTypeFromQuery || SupportedLogRenderingTypes.Default;
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
    renderingType,
  };
};
