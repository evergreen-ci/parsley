import {
  evergreenURL,
  lobsterURL,
  logkeeperURL,
} from "utils/environmentVariables";
import { stringifyQuery } from "utils/query-string";

/**
 * @param taskID - the task ID
 * @param execution - the execution number of the task
 * @param origin - the origin of the log
 * @returns a Lobster URL of the format `/evergreen/task/${taskID}/${execution}/${origin}`
 */
const getLobsterTaskURL = (
  taskID: string,
  execution: string | number,
  origin: string
) => `${lobsterURL}/evergreen/task/${taskID}/${execution}/${origin}`;

/**
 * @param taskID - the task ID
 * @param execution - the execution number of the task
 * @param testID - the test ID
 * @param groupID - the group ID (optional)
 * @returns a Lobster URL of the format `/evergreen/test/${taskID}/${execution}/${testID}/${groupID}`
 */
const getLobsterTestURL = (
  taskID: string,
  execution: string | number,
  testID: string,
  groupID?: string
) =>
  `${lobsterURL}/evergreen/test/${taskID}/${execution}/${testID}${
    groupID ? `/${groupID}` : ""
  }`;

/**
 * @param buildID - the build ID of the resmoke job
 * @param testID - the test ID of the resmoke log (optional)
 * @returns a Lobster URL of the format `/build/${buildID}/test/${testID}` or `/build/${buildID}/all`
 */
const getLobsterResmokeURL = (buildID: string, testID?: string) => {
  if (testID) {
    return `${lobsterURL}/build/${buildID}/test/${testID}`;
  }
  return `${lobsterURL}/build/${buildID}/all`;
};

/**
 *
 * @param taskID - the task ID
 * @param execution - the execution number of the task
 * @param testID - the test ID of the test
 * @param options - the options for the test log
 * @param options.text - returns the raw test log
 * @param options.groupID - the group ID
 * @returns an Evergreen URL of the format `/test_log/${taskID}/${execution}?test_name=${testID}&group_id=${groupID}text=true`
 */
const getEvergreenTestLogURL = (
  taskID: string,
  execution: string | number,
  testID: string,
  options: { text?: boolean; groupID?: string }
) => {
  const { groupID, text } = options;
  const params = {
    group_id: groupID,
    test_name: testID,
    text,
  };
  return `${evergreenURL}/test_log/${taskID}/${execution}?${stringifyQuery(
    params
  )}`;
};

/**
 *
 * @param buildID - the build ID of the resmoke job
 * @param options - the options for the resmoke log
 * @param options.testID - the testID of the resmoke log omitting this returns the full log
 * @param options.raw - returns the raw task log
 * @param options.html - returns the html viewer for the log
 * @param options.metadata - returns the build metadata associated with the log
 * @returns a Logkeeper URL of the format `/build/${buildID}/test/${testID}` or `/build/${buildID}/all`
 */
const getResmokeLogURL = (
  buildID: string,
  options: { testID?: string; raw?: boolean; html?: boolean; metadata?: true }
) => {
  const { html, metadata, raw, testID } = options;
  const params = {
    html,
    metadata,
    raw,
  };
  if (testID) {
    return `${logkeeperURL}/build/${buildID}/test/${testID}?${stringifyQuery(
      params
    )}`;
  }
  return `${logkeeperURL}/build/${buildID}/all?${stringifyQuery(params)}`;
};

// Although this does not follow typical enum capitalization conventions, it is used to map the origin of the log to the type parameter in the Evergreen URL.
// Any changes to these origins should be reflected in an ADR
enum OriginToType {
  agent = "E",
  system = "S",
  task = "T",
  all = "ALL",
}

/**
 *
 * @param taskID - the task ID
 * @param execution - the execution number of the task
 * @param origin - the origin of the log
 * @param options - the options for the task log
 * @param options.priority - returned log includes a priority prefix on each line
 * @param options.text - returns the raw log associated with the task
 * @returns an Evergreen URL of the format `/task/${taskID}/${execution}?type=${OriginToType[origin]}&text=true`
 */
const getEvergreenTaskLogURL = (
  taskID: string,
  execution: string | number,
  origin: keyof typeof OriginToType,
  options: { priority?: boolean; text?: boolean }
) => {
  const { priority, text } = options;
  const params = {
    priority,
    text,
    type: OriginToType[origin] || undefined,
  };
  return `${evergreenURL}/task_log_raw/${taskID}/${execution}?${stringifyQuery(
    params
  )}`;
};

/**
 *
 * @param taskID - the task ID
 * @param execution - the execution number of the task
 * @param fileName - the name of the file in Evergreen
 * @returns an Evergreen URL of the format `/task_file_raw/${taskID}/${execution}/${fileName}`
 */
const getEvergreenTaskFileURL = (
  taskID: string,
  execution: string | number,
  fileName: string
) => `${evergreenURL}/task_file_raw/${taskID}/${execution}/${fileName}`;

export {
  getLobsterTaskURL,
  getLobsterTestURL,
  getLobsterResmokeURL,
  getEvergreenTaskFileURL,
  getEvergreenTaskLogURL,
  getEvergreenTestLogURL,
  getResmokeLogURL,
};
