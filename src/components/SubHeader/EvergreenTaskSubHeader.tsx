import { useQuery } from "@apollo/client";
import { InlineCode } from "@leafygreen-ui/typography";
import { usePreferencesAnalytics } from "analytics";
import Breadcrumbs from "components/Breadcrumbs";
import Icon from "components/Icon";
import TaskStatusBadge from "components/TaskStatusBadge";
import { LogTypes } from "constants/enums";
import { getEvergreenTaskURL } from "constants/externalURLTemplates";
import {
  LogkeeperTaskQuery,
  LogkeeperTaskQueryVariables,
  TaskQuery,
  TaskQueryVariables,
} from "gql/generated/types";
import { GET_LOGKEEPER_TASK, GET_TASK } from "gql/queries";
import { shortenGithash } from "utils/string";

interface Props {
  buildID: string;
  execution: number;
  logType?: LogTypes;
  taskID: string;
  testID?: string;
}

export const EvergreenTaskSubHeader: React.FC<Props> = ({
  buildID,
  execution,
  logType,
  taskID,
  testID,
}) => {
  const { sendEvent } = usePreferencesAnalytics();
  const { data, loading } = useQuery<TaskQuery, TaskQueryVariables>(GET_TASK, {
    variables: { taskId: taskID, execution },
    skip: logType === LogTypes.RESMOKE_LOGS,
  });
  const { data: logkeeperData, loading: logkeeperLoading } = useQuery<
    LogkeeperTaskQuery,
    LogkeeperTaskQueryVariables
  >(GET_LOGKEEPER_TASK, {
    variables: { buildId: buildID },
    skip: logType !== LogTypes.RESMOKE_LOGS || !buildID,
  });

  const { task } = data ?? {};
  const { logkeeperBuildMetadata } = logkeeperData ?? {};

  if (loading || logkeeperLoading || (!task && !logkeeperBuildMetadata)) {
    return <Icon glyph="EvergreenLogo" size={24} />;
  }

  // @ts-expect-error - We verify above that either task or logkeeperBuildMetadata exists, so logkeeperBuildMetadata will not be undefined as TypeScript suspects
  const loadedTask = task ?? logkeeperBuildMetadata.task;
  const { displayName, patchNumber, status, versionMetadata } = loadedTask;
  const { isPatch, projectIdentifier, message, revision } =
    versionMetadata ?? {};

  const currentTest = logkeeperBuildMetadata?.tests?.find(
    (test) => test.id === testID
  );

  const breadcrumbs = [
    {
      text: projectIdentifier,
      "data-cy": "project-breadcrumb",
    },
    {
      tooltipText: message,
      "data-cy": "version-breadcrumb",
      text: isPatch ? (
        `Patch ${patchNumber}`
      ) : (
        <InlineCode>{shortenGithash(revision)}</InlineCode>
      ),
    },
    {
      href: getEvergreenTaskURL(taskID, execution),
      text: (
        <>
          {displayName} <TaskStatusBadge status={status} />
        </>
      ),
      "data-cy": "task-breadcrumb",
      onClick: () => {
        sendEvent({ name: "Opened Task Link" });
      },
    },
    ...(testID
      ? [
          {
            "data-cy": "test-breadcrumb",
            tooltipText: currentTest?.name,
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
