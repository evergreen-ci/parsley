import LogWindow from "components/LogWindow";
import { PageLayout } from "components/styles";
import { LogTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import LoadingPage from "./LogView/LoadingPage";

interface LogViewProps {
  logType: LogTypes;
}

const LogView: React.FC<LogViewProps> = ({ logType }) => {
  const { hasLogs } = useLogContext();

  return (
    <PageLayout>
      {hasLogs ? (
        <LogWindow isUploadedLog={false} logType={logType} />
      ) : (
        <LoadingPage logType={logType} />
      )}
    </PageLayout>
  );
};

export default LogView;
