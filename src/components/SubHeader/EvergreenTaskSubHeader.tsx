import { useQuery } from "@apollo/client";
import { InlineCode } from "@leafygreen-ui/typography";
import { usePreferencesAnalytics } from "analytics";
import Breadcrumbs from "components/Breadcrumbs";
import Icon from "components/Icon";
import TaskStatusBadge from "components/TaskStatusBadge";
import { getEvergreenTaskURL } from "constants/externalURLTemplates";
import { GetTaskQuery, GetTaskQueryVariables } from "gql/generated/types";
import { GET_TASK } from "gql/queries";
import { shortenGithash } from "utils/string";

interface Props {
  execution: number;
  taskID: string;
  testID?: string;
}

export const EvergreenTaskSubHeader: React.FC<Props> = ({
  execution,
  taskID,
  testID,
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

  const { isPatch, projectIdentifier, message, revision } =
    task.versionMetadata ?? {};

  const breadcrumbs = [
    {
      text: projectIdentifier,
      "data-cy": "project-link",
      onClick: () => {
        sendEvent({ name: "Opened Task Link" });
      },
    },
    {
      tooltipText: message,
      "data-cy": "version-link",
      text: isPatch ? (
        `Patch ${task.patchNumber}`
      ) : (
        <InlineCode>{shortenGithash(revision)}</InlineCode>
      ),
      onClick: () => {
        sendEvent({ name: "Opened Task Link" });
      },
    },
    {
      href: getEvergreenTaskURL(taskID, execution),
      text: (
        <>
          {task.displayName} <TaskStatusBadge status={task.status} />
        </>
      ),
      "data-cy": "task-link",
      onClick: () => {
        sendEvent({ name: "Opened Task Link" });
      },
    },
    ...(testID
      ? [
          {
            text: "Test",
          },
        ]
      : []),
  ];

  return (
    <>
      <Icon glyph="EvergreenLogo" size={24} />
      <Breadcrumbs breadcrumbs={breadcrumbs} />
    </>
  );
};
