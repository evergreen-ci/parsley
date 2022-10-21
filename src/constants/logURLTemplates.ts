import { evergreenURL, logkeeperURL } from "utils/environmentVariables";
import { stringifyQuery } from "utils/query-string";

const getEvergreenTestLogURL = (
  taskID: string,
  execution: string,
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
 * @param testID - the test ID of the resmoke job
 * @returns `/build/${buildID}/test/${testID}`
 */
const getResmokeLogURL = (
  buildID: string,
  options: { testID?: string; raw?: boolean; html?: boolean }
) => {
  const { raw, html, testID } = options;
  const params = {
    raw,
    html,
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

const getEvergreenTaskLogURL = (
  taskID: string,
  execution: string,
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
