import { useEffect } from "react";
import styled from "@emotion/styled";
import { Body } from "@leafygreen-ui/typography";
import { useParams } from "react-router-dom";
import Icon from "components/Icon";
import { LogTypes } from "constants/enums";
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
    [slugs.execution]: execution,
  } = useParams();
  const dispatchToast = useToastContext();
  const { ingestLines } = useLogContext();

  let url = "";
  switch (logType) {
    case LogTypes.RESMOKE_LOGS: {
      if (buildID && testID) {
        url = getResmokeLogURL(buildID, testID);
      } else if (buildID) {
        url = getResmokeLogURL(buildID);
      }
      break;
    }
    case LogTypes.EVERGREEN_TASK_LOGS: {
      if (!taskID || !execution || !origin) {
        break;
      }
      url = getEvergreenTaskLogURL(taskID, execution, origin as any);
      break;
    }
    case LogTypes.EVERGREEN_TEST_LOGS: {
      if (!taskID || !execution || !testID) {
        break;
      }
      url = getEvergreenTestLogURL(taskID, execution, testID);
      break;
    }
    default:
      break;
  }

  const { data, error, isLoading } = useAxiosGet(url);
  useEffect(() => {
    if (data) {
      leaveBreadcrumb("ingest-log-lines", { logType }, "process");
      ingestLines(data.trimEnd().split("\n"), logType);
    }
    if (error) {
      dispatchToast.error(error);
    }
  }, [data, ingestLines, error, logType, dispatchToast]);

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
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: flex-end;
  margin-bottom: ${size.s};
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
