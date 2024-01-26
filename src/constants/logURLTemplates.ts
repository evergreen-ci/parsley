import queryString from "query-string";
import { Task as TaskType } from "gql/generated/types";
import { evergreenURL, logkeeperURL } from "utils/environmentVariables";
import { stringifyQuery } from "utils/query-string";

/**
 *
 * @param taskID - the task ID
 * @param execution - the execution number of the task
 * @param testID - the test ID of the test
 * @param options - the options for the test log
 * @param options.text - returns the raw test log
 * @param options.groupID - the group ID
 * @returns an Evergreen URL of the format `/test_log/${taskID}/${execution}?test_name=${testID}&group_id=${groupID}text=true`
 */
const getEvergreenTestLogURL = (
  taskID: string,
  execution: string | number,
  testID: string,
  options: { text?: boolean; groupID?: string },
) => {
  const { groupID, text } = options;
  const params = {
    group_id: groupID,
    test_name: testID,
    text,
  };
  return `${evergreenURL}/test_log/${taskID}/${execution}?${stringifyQuery(
    params,
  )}`;
};

/**
 *
 * @param buildID - the build ID of the resmoke job
 * @param options - the options for the resmoke log
 * @param options.testID - the testID of the resmoke log omitting this returns the full log
 * @param options.raw - returns the raw task log
 * @param options.html - returns the html viewer for the log
 * @param options.metadata - returns the build metadata associated with the log
 * @returns a Logkeeper URL of the format `/build/${buildID}/test/${testID}` or `/build/${buildID}/all`
 */
const getResmokeLogURL = (
  buildID: string,
  options: { testID?: string; raw?: boolean; html?: boolean; metadata?: true },
) => {
  const { html, metadata, raw, testID } = options;
  const params = {
    html,
    metadata,
    raw,
  };
  if (testID) {
    return `${logkeeperURL}/build/${buildID}/test/${testID}?${stringifyQuery(
      params,
    )}`;
  }
  return `${logkeeperURL}/build/${buildID}/all?${stringifyQuery(params)}`;
};

export enum Origin {
  Agent = "agent",
  System = "system",
  Task = "task",
  All = "all",
}

const getEvergreenTaskLogURL = (
  logLinks: TaskType["logs"],
  origin: string,
  params: { priority?: boolean; text?: boolean } = {},
) => {
  const url =
    {
      [Origin.Agent]: logLinks.agentLogLink,
      [Origin.System]: logLinks.systemLogLink,
      [Origin.Task]: logLinks.taskLogLink,
      [Origin.All]: logLinks.allLogLink,
    }[origin] ?? "";
  return queryString.stringifyUrl({ query: params, url });
};

const mapOriginToType = {
  [Origin.Agent]: "E",
  [Origin.All]: "ALL",
  [Origin.System]: "S",
  [Origin.Task]: "T",
};

/**
 * constructEvergreenTaskLogURL constructs an Evergreen task link as a fallback using the task's parameters.
 * @param taskID - the task ID
 * @param execution - the execution number of the task
 * @param origin - the origin of the log
 * @param options - the options for the task log
 * @param options.priority - returned log includes a priority prefix on each line
 * @param options.text - returns the raw log associated with the task
 * @returns an Evergreen URL of the format `/task/${taskID}/${execution}?type=${OriginToType[origin]}&text=true`
 */
const constructEvergreenTaskLogURL = (
  taskID: string,
  execution: string | number,
  origin: string,
  options: { priority?: boolean; text?: boolean },
) => {
  const { priority, text } = options;
  const params = {
    priority,
    text,
    type: mapOriginToType[origin as Origin] || undefined,
  };
  return `${evergreenURL}/task_log_raw/${taskID}/${execution}?${stringifyQuery(
    params,
  )}`;
};

/**
 *
 * @param taskID - the task ID
 * @param execution - the execution number of the task
 * @param fileName - the name of the file in Evergreen
 * @returns an Evergreen URL of the format `/task_file_raw/${taskID}/${execution}/${fileName}`
 */
const getEvergreenTaskFileURL = (
  taskID: string,
  execution: string | number,
  fileName: string,
) => `${evergreenURL}/task_file_raw/${taskID}/${execution}/${fileName}`;

export {
  constructEvergreenTaskLogURL,
  getEvergreenTaskFileURL,
  getEvergreenTaskLogURL,
  getEvergreenTestLogURL,
  getResmokeLogURL,
};
