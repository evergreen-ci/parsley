import {
  evergreenURL,
  logkeeperURL,
  spruceURL,
} from "utils/environmentVariables";
import { stringifyQuery } from "utils/query-string";

const evergreenParams = { redirect_spruce_users: true };

const getSpruceCommitQueueURL = (projectIdentifier: string) =>
  `${spruceURL}/commits/${projectIdentifier}`;

const getEvergreenVersionURL = (versionId: string) =>
  `${evergreenURL}/version/${versionId}?${stringifyQuery(evergreenParams)}`;

const getEvergreenTaskURL = (taskID: string, execution: string | number) =>
  `${evergreenURL}/task/${taskID}/${execution}?${stringifyQuery(
    evergreenParams
  )}`;

const getJobLogsURL = (buildID: string) => `${spruceURL}/job-logs/${buildID}`;

const getLegacyJobLogsURL = (buildID: string) =>
  `${logkeeperURL}/build/${buildID}`;

export {
  getEvergreenTaskURL,
  getEvergreenVersionURL,
  getJobLogsURL,
  getLegacyJobLogsURL,
  getSpruceCommitQueueURL,
};
