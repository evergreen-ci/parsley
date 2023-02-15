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
  groupId?: string
) =>
  `${lobsterURL}/evergreen/test/${taskID}/${execution}/${testID}${
    groupId ? `/${groupId}` : ""
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
  const { text, groupID } = options;
  const params = {
    test_name: testID,
    group_id: groupID,
    text,
  };
  return `${evergreenURL}/test_log/${taskID}/${execution}?${stringifyQuery(
    params
  )}`;
};

/**
 *
 * @param buildID - the build ID of the resmoke job
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
  const { raw, html, testID, metadata } = options;
  const params = {
    raw,
    html,
    metadata,
  };
  if (testID) {
    return `${logkeeperURL}/build/${buildID}/test/${testID}?${stringifyQuery(
      params
    )}`;
  }
  return `${logkeeperURL}/build/${buildID}/all?${stringifyQuery(params)}`;
};

// Although this does not follow typical enum capitalization conventions, it is used to map the origin of the log to the type parameter in the Evergreen URL.
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
 * @param options.text - returns the raw log associated with the task
 * @returns an Evergreen URL of the format `/task/${taskID}/${execution}?type=${OriginToType[origin]}&text=true`
 */
const getEvergreenTaskLogURL = (
  taskID: string,
  execution: string | number,
  origin: keyof typeof OriginToType,
  options: { text?: boolean }
) => {
  const { text } = options;
  const params = {
    text,
    type: OriginToType[origin] || undefined,
  };
  return `${evergreenURL}/task_log_raw/${taskID}/${execution}?${stringifyQuery(
    params
  )}`;
};

export {
  getLobsterTaskURL,
  getLobsterTestURL,
  getLobsterResmokeURL,
  getEvergreenTaskLogURL,
  getEvergreenTestLogURL,
  getResmokeLogURL,
};
