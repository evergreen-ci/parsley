import { evergreenURL, logkeeperURL } from "utils/environmentVariables";
import { stringifyQuery } from "utils/query-string";

/**
 *
 * @param taskID - the task ID
 * @param execution - the execution number of the task
 * @param testID - the test ID of the test
 * @param options.text - returns the raw test log
 * @returns /test_log/${taskID}/${execution}?test_name=${testID}&text=true
 */
const getEvergreenTestLogURL = (
  taskID: string,
  execution: string | number,
  testID: string,
  options: { text?: boolean }
) => {
  const { text } = options;
  const params = {
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
 * @param options.testID - the testID of the resmoke log omitting this returns the full log
 * @param options.raw - returns the raw task log
 * @param options.html - returns the html viewer for the log
 * @param options.metadata - returns the build metadata associated with the log
 * @returns `/build/${buildID}/test/${testID}`
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

enum originToType {
  agent = "A",
  system = "S",
  task = "T",
}

/**
 *
 * @param taskID - the task ID
 * @param execution - the execution number of the task
 * @param origin - the origin of the log
 * @param options.text - returns the raw log associated with the task
 * @returns /task/${taskID}/${execution}?type=${originToType[origin]}&text=true
 */
const getEvergreenTaskLogURL = (
  taskID: string,
  execution: string | number,
  origin: keyof typeof originToType,
  options: { text?: boolean }
) => {
  const { text } = options;
  const params = {
    text,
    type: originToType[origin] || undefined,
  };
  return `${evergreenURL}/task_log_raw/${taskID}/${execution}?${stringifyQuery(
    params
  )}`;
};

export { getEvergreenTestLogURL, getResmokeLogURL, getEvergreenTaskLogURL };
