import { useQuery } from "@apollo/client";
import { InlineCode } from "@leafygreen-ui/typography";
import { usePreferencesAnalytics } from "analytics";
import Breadcrumbs from "components/Breadcrumbs";
import Icon from "components/Icon";
import { TaskStatusBadge, TestStatusBadge } from "components/StatusBadge";
import { StyledLink } from "components/styles";
import { LogTypes } from "constants/enums";
import { getEvergreenTaskURL } from "constants/externalURLTemplates";
import {
  LogkeeperTaskQuery,
  LogkeeperTaskQueryVariables,
  TaskQuery,
  TaskQueryVariables,
} from "gql/generated/types";
import { GET_LOGKEEPER_TASK, GET_TASK } from "gql/queries";
import { shortenGithash, trimStringFromMiddle } from "utils/string";

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
  const isResmoke = logType === LogTypes.RESMOKE_LOGS;

  const { data, loading } = useQuery<TaskQuery, TaskQueryVariables>(GET_TASK, {
    variables: { taskId: taskID, execution },
    skip: isResmoke,
  });

  const { data: logkeeperData, loading: logkeeperLoading } = useQuery<
    LogkeeperTaskQuery,
    LogkeeperTaskQueryVariables
  >(GET_LOGKEEPER_TASK, {
    variables: { buildId: buildID },
    skip: !isResmoke || !buildID,
  });

  const { task } = data ?? {};
  const { logkeeperBuildMetadata } = logkeeperData ?? {};
  const loadedTask = task ?? logkeeperBuildMetadata?.task;

  if (loading || logkeeperLoading || !loadedTask) {
    return (
      <>
        <Icon glyph="EvergreenLogo" size={24} />
        <StyledLink
          href={getEvergreenTaskURL(taskID, execution)}
          onClick={() => sendEvent({ name: "Opened Task Link" })}
        >
          Task Page
        </StyledLink>
      </>
    );
  }

  const {
    displayName,
    execution: taskExecution,
    patchNumber,
    status,
    versionMetadata,
  } = loadedTask;
  const { isPatch, projectIdentifier, message, revision } = versionMetadata;

  const currentTest = isResmoke
    ? logkeeperBuildMetadata?.task?.tests?.testResults?.find((test) =>
        test?.logs?.urlRaw?.match(new RegExp(`${testID}`))
      )
    : null;

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
      href: getEvergreenTaskURL(taskID, taskExecution),
      text: (
        <>
          {trimStringFromMiddle(displayName, 30)}{" "}
          <TaskStatusBadge status={status} />
        </>
      ),
      "data-cy": "task-breadcrumb",
      tooltipText: displayName.length > 30 && displayName,
      onClick: () => {
        sendEvent({ name: "Opened Task Link" });
      },
    },
    ...(testID
      ? [
          {
            "data-cy": "test-breadcrumb",
            text: (
              <>
                {trimStringFromMiddle(currentTest?.testFile ?? "Test", 80)}{" "}
                <TestStatusBadge status={currentTest?.status} />
              </>
            ),
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
