import LogWindow from "components/LogWindow";
import { LogTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import LoadingPage from "./LogView/LoadingPage";

interface LogViewProps {
  logType: LogTypes;
}

const LogView: React.FC<LogViewProps> = ({ logType }) => {
  const { hasLogs } = useLogContext();
  return hasLogs === null ? <LoadingPage logType={logType} /> : <LogWindow />;
};

export default LogView;
