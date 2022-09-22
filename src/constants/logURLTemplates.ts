import { evergreenURL, logkeeperURL } from "utils/environmentVariables";
import { stringifyQuery } from "utils/query-string";

const getEvergreenTestLogURL = (
  taskID: string,
  execution: string,
  testID: string
) => {
  const params = {
    test_name: testID,
    text: true,
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
const getResmokeLogURL = (buildID: string, testID?: string) => {
  const params = {
    raw: 1,
    s3: true, // TODO: Remove this once this becomes the default
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
  origin: keyof typeof originToType
) => {
  const params = {
    text: true,
    type: originToType[origin] || undefined,
  };
  return `${evergreenURL}/task_log_raw/${taskID}/${execution}?${stringifyQuery(
    params
  )}`;
};

export { getEvergreenTestLogURL, getResmokeLogURL, getEvergreenTaskLogURL };
