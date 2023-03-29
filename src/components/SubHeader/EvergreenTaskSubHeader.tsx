import { useQuery } from "@apollo/client";
import { usePreferencesAnalytics } from "analytics";
import Breadcrumbs from "components/Breadcrumbs";
import Icon from "components/Icon";
import TaskStatusBadge from "components/TaskStatusBadge";
import {
  getEvergreenTaskURL,
  getEvergreenVersionURL,
  getSpruceCommitQueueURL,
} from "constants/externalURLTemplates";
import { GetTaskQuery, GetTaskQueryVariables } from "gql/generated/types";
import { GET_TASK } from "gql/queries";
import { shortenGithash } from "utils/string";

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
    { variables: { taskId: taskID, execution } }
  );

  const { task } = data ?? {};

  if (loading || !task) {
    return <Icon glyph="EvergreenLogo" size={24} />;
  }

  const { id, isPatch, projectIdentifier, message, revision } =
    task.versionMetadata ?? {};

  const breadcrumbs = [
    {
      href: getSpruceCommitQueueURL(projectIdentifier),
      text: projectIdentifier,
      "data-cy": "project-link",
      onClick: () => {
        sendEvent({ name: "Opened Task Link" });
      },
    },
    {
      href: getEvergreenVersionURL(id),
      text: `${
        isPatch ? `Patch ${task.patchNumber}` : shortenGithash(revision)
      } - ${message}`,
      "data-cy": "version-link",
      onClick: () => {
        sendEvent({ name: "Opened Task Link" });
      },
    },
    {
      href: getEvergreenTaskURL(taskID, execution),
      text: task.displayName,
      "data-cy": "task-link",
      onClick: () => {
        sendEvent({ name: "Opened Task Link" });
      },
    },
  ];

  return (
    <>
      <Icon glyph="EvergreenLogo" size={24} />
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <TaskStatusBadge status={task.status} />
    </>
  );
};
