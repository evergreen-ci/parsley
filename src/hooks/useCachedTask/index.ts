import { useApolloClient } from "@apollo/client";
import { LogTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import { LogkeeperTaskQuery, TaskQuery } from "gql/generated/types";
import { GET_LOGKEEPER_TASK, GET_TASK } from "gql/queries";

export const useCachedTask = () => {
  const { logMetadata } = useLogContext();
  const { cache } = useApolloClient();
  const { buildID, taskID, execution, logType } = logMetadata ?? {};

  if (logType === LogTypes.RESMOKE_LOGS) {
    const data = cache.readQuery<LogkeeperTaskQuery>({
      query: GET_LOGKEEPER_TASK,
      variables: { buildId: buildID },
    });
    return data?.logkeeperBuildMetadata?.task;
  }

  const data = cache.readQuery<TaskQuery>({
    query: GET_TASK,
    variables: { taskId: taskID, execution: Number(execution) },
  });
  return data?.task;
};
