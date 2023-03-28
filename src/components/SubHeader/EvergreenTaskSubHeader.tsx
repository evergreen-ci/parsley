import { useQuery } from "@apollo/client";
import { usePreferencesAnalytics } from "analytics";
import Icon from "components/Icon";
import { StyledLink } from "components/styles";
import TaskStatusBadge from "components/TaskStatusBadge";
import { getEvergreenTaskURL } from "constants/externalURLTemplates";
import { GetTaskQuery, GetTaskQueryVariables } from "gql/generated/types";
import { GET_TASK } from "gql/queries";

interface Props {
  taskID: string;
  execution: number;
}

export const EvergreenTaskSubHeader: React.FC<Props> = ({
  taskID,
  execution,
}) => {
  const { sendEvent } = usePreferencesAnalytics();
  const { data, loading } = useQuery<GetTaskQuery, GetTaskQueryVariables>(
    GET_TASK,
    {
      variables: { taskId: taskID as string, execution: Number(execution) },
    }
  );

  const { task } = data ?? {};
  const taskLink = getEvergreenTaskURL(taskID, execution);

  return (
    <>
      <Icon glyph="EvergreenLogo" size={24} />
      {!loading && (
        <>
          <StyledLink
            data-cy="spruce-link"
            href={taskLink}
            onClick={() => sendEvent({ name: "Opened Task Link" })}
            target="_blank"
            title="Open task in Spruce"
          >
            {task?.displayName || "Task"}
          </StyledLink>
          {task?.status && <TaskStatusBadge status={task.status} />}
        </>
      )}
    </>
  );
};
