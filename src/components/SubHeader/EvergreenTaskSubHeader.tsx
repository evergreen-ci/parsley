import { InlineCode } from "@leafygreen-ui/typography";
import { usePreferencesAnalytics } from "analytics";
import { TaskStatusBadge, TestStatusBadge } from "components/Badge";
import Breadcrumbs from "components/Breadcrumbs";
import Icon from "components/Icon";
import { StyledLink } from "components/styles";
import { LogTypes } from "constants/enums";
import { getEvergreenTaskURL } from "constants/externalURLTemplates";
import { useTaskQuery } from "hooks/useTaskQuery";
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
  const { loading, task } = useTaskQuery({
    logType,
    taskID,
    execution,
    buildID,
  });

  if (loading || !task) {
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
  } = task;
  const { isPatch, message, projectIdentifier, revision } = versionMetadata;

  const currentTest =
    task?.tests?.testResults?.find((test) =>
      test?.logs?.urlRaw?.match(new RegExp(`${testID}`))
    ) ?? null;

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
            tooltipText:
              currentTest &&
              currentTest.testFile.length > 80 &&
              currentTest.testFile,
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
