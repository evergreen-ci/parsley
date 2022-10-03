import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { LogTypes } from "constants/enums";
import {
  getEvergreenTaskLogURL,
  getEvergreenTestLogURL,
  getResmokeLogURL,
} from "constants/logURLTemplates";
import { slugs } from "constants/routes";
import { useLogContext } from "context/LogContext";
import { useToastContext } from "context/toast";
import { useAxiosGet } from "hooks";

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

  const { data, error } = useAxiosGet(url);
  useEffect(() => {
    if (data) {
      ingestLines(data.trim().split("\n"), logType);
      onLoad();
    }
    if (error) {
      dispatchToast.error(error);
    }
  }, [data, ingestLines, error, onLoad, logType, dispatchToast]);
  return <div>I am the loading page</div>;
};

export default LoadingPage;
