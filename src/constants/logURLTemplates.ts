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
  return `${evergreenURL}/test_log/${taskID}/${execution}/?${stringifyQuery(
    params
  )}`;
};

const getResmokeLogURL = (buildID: string, testID: string) => {
  const params = {
    raw: 1,
    s3: true, // TODO: Remove this once this becomes the default
  };
  return `${logkeeperURL}/build/${buildID}/test/${testID}?${stringifyQuery(
    params
  )}`;
};

const getEvergreenTaskLogURL = (
  taskID: string,
  execution: string,
  origin: string
) => {
  const params = {
    text: true,
    type: origin,
  };
  return `${evergreenURL}/task_log_raw/${taskID}/${execution}?${stringifyQuery(
    params
  )}`;
};

export { getEvergreenTestLogURL, getResmokeLogURL, getEvergreenTaskLogURL };
