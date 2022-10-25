import { spruceURL } from "utils/environmentVariables";

const getSpruceJobLogsURL = (taskID: string, execution: string) =>
  `${spruceURL}/job-logs/${taskID}/${execution}`;

export { getSpruceJobLogsURL };
