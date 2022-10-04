import { evergreenURL } from "utils/environmentVariables";
import { stringifyQuery } from "utils/query-string";

const getEvergreenTaskURL = (taskID: string, execution: string) => {
  const params = {
    redirectSpruceUsers: true,
  };
  return `${evergreenURL}/task/${taskID}/${execution}?${stringifyQuery(
    params
  )}`;
};

export { getEvergreenTaskURL };
