import LogWindow from "components/LogWindow";
import { LogTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import LoadingPage from "./LogView/LoadingPage";

interface LogViewProps {
  logType: LogTypes;
}

const LogView: React.FC<LogViewProps> = ({ logType }) => {
  const { hasLogs, logsAreEmpty } = useLogContext();

  return hasLogs || logsAreEmpty ? (
    <LogWindow isUploadedLog={false} logType={logType} />
  ) : (
    <LoadingPage logType={logType} />
  );
};

export default LogView;
