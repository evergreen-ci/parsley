import { useQuery } from "@apollo/client";
import { LogTypes } from "constants/enums";
import {
  LogkeeperTaskQuery,
  LogkeeperTaskQueryVariables,
  TaskQuery,
  TaskQueryVariables,
  TaskTestResult,
} from "gql/generated/types";
import { GET_LOGKEEPER_TASK, GET_TASK } from "gql/queries";

interface UseTaskQueryProps {
  logType?: LogTypes;
  taskID?: string;
  execution?: string | number;
  buildID?: string;
}

type UseTaskQueryReturnType = {
  task: (TaskQuery["task"] & { tests?: TaskTestResult }) | undefined | null;
  loading: boolean;
};

export const useTaskQuery = ({
  buildID,
  execution,
  logType,
  taskID,
}: UseTaskQueryProps): UseTaskQueryReturnType => {
  const isResmoke = logType === LogTypes.RESMOKE_LOGS;

  const { data: taskData, loading: taskLoading } = useQuery<
    TaskQuery,
    TaskQueryVariables
  >(GET_TASK, {
    variables: { taskId: String(taskID), execution: Number(execution) },
    skip: isResmoke || !taskID,
  });

  const { data: logkeeperData, loading: logkeeperLoading } = useQuery<
    LogkeeperTaskQuery,
    LogkeeperTaskQueryVariables
  >(GET_LOGKEEPER_TASK, {
    variables: { buildId: String(buildID) },
    skip: !isResmoke || !buildID,
  });

  const { task } = taskData ?? {};
  const { logkeeperBuildMetadata } = logkeeperData ?? {};
  const loadedTask = logkeeperBuildMetadata?.task ?? task;

  return { task: loadedTask, loading: taskLoading || logkeeperLoading };
};
