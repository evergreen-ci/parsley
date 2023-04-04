import { useQuery } from "@apollo/client";
import { InlineCode } from "@leafygreen-ui/typography";
import { usePreferencesAnalytics } from "analytics";
import Breadcrumbs from "components/Breadcrumbs";
import Icon from "components/Icon";
import TaskStatusBadge from "components/TaskStatusBadge";
import { LogTypes } from "constants/enums";
import { getEvergreenTaskURL } from "constants/externalURLTemplates";
import { GetTaskQuery, GetTaskQueryVariables } from "gql/generated/types";
import { GET_TASK } from "gql/queries";
import { shortenGithash } from "utils/string";

interface Props {
  execution: number;
  logType?: LogTypes;
  taskID: string;
  testID?: string;
}

export const EvergreenTaskSubHeader: React.FC<Props> = ({
  execution,
  logType,
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

  const isResmokeTest = testID && logType === LogTypes.RESMOKE_LOGS;

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
      text: task.displayName,
      "data-cy": "task-link",
      onClick: () => {
        sendEvent({ name: "Opened Task Link" });
      },
    },
    ...(isResmokeTest
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
      {!isResmokeTest && <TaskStatusBadge status={task.status} />}
    </>
  );
};
