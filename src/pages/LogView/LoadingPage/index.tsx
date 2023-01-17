import { useEffect } from "react";
import styled from "@emotion/styled";
import { Body } from "@leafygreen-ui/typography";
import { useParams } from "react-router-dom";
import Icon from "components/Icon";
import { LogTypes } from "constants/enums";
import { getJobLogsURL } from "constants/externalURLTemplates";
import {
  getEvergreenTaskLogURL,
  getEvergreenTestLogURL,
  getLobsterResmokeURL,
  getLobsterTaskURL,
  getLobsterTestURL,
  getResmokeLogURL,
} from "constants/logURLTemplates";
import { slugs } from "constants/routes";
import { fontSize, size } from "constants/tokens";
import { useLogContext } from "context/LogContext";
import { useToastContext } from "context/toast";
import { useLogDownloader } from "hooks";
import { useFetch } from "hooks/useFetch";
import NotFound from "pages/404";
import { LogkeeperMetadata } from "types/api";
import { leaveBreadcrumb } from "utils/errorReporting";
import LoadingBar from "./LoadingBar";

interface LoadingPageProps {
  logType: LogTypes;
}

const LoadingPage: React.FC<LoadingPageProps> = ({ logType }) => {
  const {
    [slugs.buildID]: buildID,
    [slugs.origin]: origin,
    [slugs.testID]: testID,
    [slugs.taskID]: taskID,
    [slugs.groupID]: groupID,
    [slugs.execution]: execution,
  } = useParams();
  const dispatchToast = useToastContext();
  const { ingestLines, setLogMetadata } = useLogContext();

  let rawLogURL = "";
  let htmlLogURL = "";
  let jobLogsURL = "";
  let lobsterURL = "";
  const { data: logkeeperMetadata } = useFetch<LogkeeperMetadata>(
    getResmokeLogURL(buildID || "", { testID, metadata: true }),
    {
      skip: buildID === undefined,
    }
  );
  switch (logType) {
    case LogTypes.RESMOKE_LOGS: {
      if (buildID && testID) {
        rawLogURL = getResmokeLogURL(buildID, { testID, raw: true });
        htmlLogURL = getResmokeLogURL(buildID, { testID, html: true });
        lobsterURL = getLobsterResmokeURL(buildID, testID);
      } else if (buildID) {
        rawLogURL = getResmokeLogURL(buildID, { raw: true });
        htmlLogURL = getResmokeLogURL(buildID, { html: true });
        lobsterURL = getLobsterResmokeURL(buildID);
      }
      if (buildID) {
        jobLogsURL = getJobLogsURL(buildID);
      }
      break;
    }
    case LogTypes.EVERGREEN_TASK_LOGS: {
      if (!taskID || !execution || !origin) {
        break;
      }
      rawLogURL = getEvergreenTaskLogURL(taskID, execution, origin as any, {
        text: true,
      });
      htmlLogURL = getEvergreenTaskLogURL(taskID, execution, origin as any, {
        text: false,
      });
      lobsterURL = getLobsterTaskURL(taskID, execution, origin);
      break;
    }
    case LogTypes.EVERGREEN_TEST_LOGS: {
      if (!taskID || !execution || !testID) {
        break;
      }
      rawLogURL = getEvergreenTestLogURL(taskID, execution, testID, {
        text: true,
        groupID,
      });
      htmlLogURL = getEvergreenTestLogURL(taskID, execution, testID, {
        text: false,
        groupID,
      });
      lobsterURL = getLobsterTestURL(taskID, execution, testID, groupID);
      break;
    }
    default:
      break;
  }

  const { data, error, isLoading } = useLogDownloader(rawLogURL, logType);

  useEffect(() => {
    if (data) {
      leaveBreadcrumb("ingest-log-lines", { logType }, "process");
      setLogMetadata({
        logType,
        taskID: taskID || logkeeperMetadata?.task_id,
        execution: execution || String(logkeeperMetadata?.execution || 0),
        testID,
        origin,
        buildID,
        rawLogURL,
        htmlLogURL,
        jobLogsURL,
        lobsterURL,
      });
      ingestLines(data, logType);
    }
    if (error) {
      dispatchToast.error(error);
    }
  }, [
    data,
    ingestLines,
    error,
    logType,
    dispatchToast,
    setLogMetadata,
    taskID,
    execution,
    testID,
    origin,
    buildID,
    rawLogURL,
    htmlLogURL,
    jobLogsURL,
    lobsterURL,
    logkeeperMetadata?.task_id,
    logkeeperMetadata?.execution,
  ]);

  return (
    <Container>
      {isLoading || !error ? (
        <LoadingBarContainer>
          <LogoContainer>
            <StyledIcon glyph="ParsleyLogo" size={40} useStroke />
            <StyledBody>Loading Parsley...</StyledBody>
          </LogoContainer>
          <LoadingBar indeterminate />
        </LoadingBarContainer>
      ) : (
        <NotFound />
      )}
    </Container>
  );
};

const LoadingBarContainer = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  width: 40%;
  gap: ${size.s};
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: flex-end;
`;

const StyledBody = styled(Body)`
  font-size: ${fontSize.l};
`;

const StyledIcon = styled(Icon)`
  margin-right: ${size.s};
  animation: sway infinite 3s ease-in-out;
  transform-origin: bottom;
  @keyframes sway {
    0% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(-5deg);
    }
    50% {
      transform: rotate(5deg);
    }
    75% {
      transform: rotate(-5deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
`;

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
`;

export default LoadingPage;
