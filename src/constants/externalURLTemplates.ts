import { evergreenURL, spruceURL } from "utils/environmentVariables";
import { stringifyQuery } from "utils/query-string";

const getEvergreenTaskURL = (taskID: string, execution: string) => {
  const params = {
    redirectSpruceUsers: true,
  };
  return `${evergreenURL}/task/${taskID}/${execution}?${stringifyQuery(
    params
  )}`;
};

const getSpruceJobLogsURL = (taskID: string, execution: string) =>
  `${spruceURL}/job-logs/${taskID}/${execution}`;

export { getSpruceJobLogsURL, getEvergreenTaskURL };
