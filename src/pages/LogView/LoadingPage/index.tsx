import { useEffect } from "react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import { useParams } from "react-router-dom";
import Icon from "components/Icon";
import { LogTypes } from "constants/enums";
import { getSpruceJobLogsURL } from "constants/externalURLTemplates";
import {
  getEvergreenTaskLogURL,
  getEvergreenTestLogURL,
  getResmokeLogURL,
} from "constants/logURLTemplates";
import { slugs } from "constants/routes";
import { fontSize, size } from "constants/tokens";
import { useLogContext } from "context/LogContext";
import { useToastContext } from "context/toast";
import { useAxiosGet } from "hooks";
import NotFound from "pages/404";
import { leaveBreadcrumb } from "utils/errorReporting";
import { convertBytesToUnitString } from "./utils";

const { green } = palette;
interface LoadingPageProps {
  logType: LogTypes;
}

const LoadingPage: React.FC<LoadingPageProps> = ({ logType }) => {
  const {
    [slugs.buildID]: buildID,
    [slugs.origin]: origin,
    [slugs.testID]: testID,
    [slugs.taskID]: taskID,
    [slugs.execution]: execution,
  } = useParams();
  const dispatchToast = useToastContext();
  const { ingestLines, setLogMetadata } = useLogContext();

  let url = "";
  let htmlLogURL = "";
  let jobLogsURL = "";
  switch (logType) {
    case LogTypes.RESMOKE_LOGS: {
      if (buildID && testID) {
        url = getResmokeLogURL(buildID, { testID, raw: true });
        htmlLogURL = getResmokeLogURL(buildID, { testID, html: true });
      } else if (buildID) {
        url = getResmokeLogURL(buildID, { raw: true });
        htmlLogURL = getResmokeLogURL(buildID, { html: true });
      }
      break;
    }
    case LogTypes.EVERGREEN_TASK_LOGS: {
      if (!taskID || !execution || !origin) {
        break;
      }
      url = getEvergreenTaskLogURL(taskID, execution, origin as any, {
        text: true,
      });
      htmlLogURL = getEvergreenTaskLogURL(taskID, execution, origin as any, {
        text: false,
      });
      jobLogsURL = getSpruceJobLogsURL(taskID, execution);
      break;
    }
    case LogTypes.EVERGREEN_TEST_LOGS: {
      if (!taskID || !execution || !testID) {
        break;
      }
      url = getEvergreenTestLogURL(taskID, execution, testID, { text: true });
      htmlLogURL = getEvergreenTestLogURL(taskID, execution, testID, {
        text: false,
      });
      jobLogsURL = getSpruceJobLogsURL(taskID, execution);
      break;
    }
    default:
      break;
  }

  const { data, error, isLoading, downloadProgress } = useAxiosGet(url);

  useEffect(() => {
    if (data) {
      leaveBreadcrumb("ingest-log-lines", { logType }, "process");
      ingestLines(data.trimEnd().split("\n"), logType);
      setLogMetadata({
        taskID,
        execution,
        testID,
        origin,
        buildID,
        rawLogURL: url,
        htmlLogURL,
        jobLogsURL,
      });
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
    url,
    htmlLogURL,
    jobLogsURL,
  ]);

  return (
    <Container>
      {isLoading || !error ? (
        <LoadingBarContainer>
          <LogoContainer>
            <StyledIcon glyph="ParsleyLogo" size={144} useStroke />
            <SpaceBetween>
              <StyledBody>Loading Parsley...</StyledBody>
              {downloadProgress && (
                <StyledLoadingProgressText>
                  {convertBytesToUnitString(downloadProgress)}
                </StyledLoadingProgressText>
              )}
            </SpaceBetween>
          </LogoContainer>
        </LoadingBarContainer>
      ) : (
        <NotFound />
      )}
    </Container>
  );
};

const LoadingBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 20%;
  align-items: center;
  justify-content: center;
`;

const StyledLoadingProgressText = styled.pre`
  color: ${green};
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const SpaceBetween = styled.div`
  margin-bottom: ${size.s};
  display: flex;
  justify-content: space-between;
  width: 100%;
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
