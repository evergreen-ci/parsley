import { evergreenURL, logkeeperURL } from "utils/environmentVariables";
import { stringifyQuery } from "utils/query-string";

const getEvergreenTaskURL = (taskID: string, execution: string | number) => {
  const params = {
    redirect_spruce_users: true,
  };
  return `${evergreenURL}/task/${taskID}/${execution}?${stringifyQuery(
    params
  )}`;
};

const getJobLogsURL = (buildID: string) => `${logkeeperURL}/build/${buildID}`;
export { getEvergreenTaskURL, getJobLogsURL };
