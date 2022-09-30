import { useEffect } from "react";
import styled from "@emotion/styled";
import { useParams } from "react-router-dom";
import { LogTypes } from "constants/enums";
import {
  getEvergreenTaskLogURL,
  getEvergreenTestLogURL,
  getResmokeLogURL,
} from "constants/logURLTemplates";
import { slugs } from "constants/routes";
import { size } from "constants/tokens";
import { useLogContext } from "context/LogContext";
import { useToastContext } from "context/toast";
import { useAxiosGet } from "hooks";
import LoadingBar from "./LoadingBar";

interface LoadingPageProps {
  onLoad: () => void;
  logType: LogTypes;
}

const LoadingPage: React.FC<LoadingPageProps> = ({ onLoad, logType }) => {
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
      ingestLines(data.split("\n"), logType);
      onLoad();
    }
    if (error) {
      dispatchToast.error(error);
    }
  }, [data, ingestLines, error, onLoad, logType, dispatchToast]);
  return (
    <Container>
      {isLoading || !error ? (
        <LoadingBarContainer>
          <LogoContainer>🌿 Loading Parsley...</LogoContainer>
          <LoadingBar indeterminate />
        </LoadingBarContainer>
      ) : (
        <div>404 here</div>
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
  align-items: center;
  display: flex;
  margin-bottom: ${size.xs};
`;

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
`;

export default LoadingPage;
