import { evergreenURL, spruceURL } from "utils/environmentVariables";
import { stringifyQuery } from "utils/query-string";

const getEvergreenTaskURL = (taskID: string, execution: string | number) => {
  const params = {
    redirect_spruce_users: true,
  };
  return `${evergreenURL}/task/${taskID}/${execution}?${stringifyQuery(
    params
  )}`;
};

const getSpruceJobLogsURL = (taskID: string, execution: string | number) =>
  `${spruceURL}/job-logs/${taskID}/${execution}`;

export { getSpruceJobLogsURL, getEvergreenTaskURL };
