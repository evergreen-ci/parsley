import { useEffect } from "react";
import styled from "@emotion/styled";
import { useParams } from "react-router-dom";
import { PageLayout } from "components/styles";
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
import LoadingBar from "./LoadingPage/LoadingBar";

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
    <StyledPageLayout>
      {isLoading || !error ? (
        <LoadingBarContainer>
          <LogoContainer>🌿 Loading Lobster...</LogoContainer>
          <LoadingBar indeterminate progress={100} />
        </LoadingBarContainer>
      ) : (
        <div>404 here</div>
      )}
    </StyledPageLayout>
  );
};

const LoadingBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 40%;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${size.xs};
`;
const StyledPageLayout = styled(PageLayout)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
export default LoadingPage;
