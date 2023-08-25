import LogWindow from "components/LogWindow";
import { LogTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import LoadingPage from "./LogView/LoadingPage";

interface LogViewProps {
  logType: LogTypes;
}

const LogView: React.FC<LogViewProps> = ({ logType }) => {
  const { loading } = useLogContext();

  return loading ? (
    <LoadingPage logType={logType} />
  ) : (
    <LogWindow isUploadedLog={false} logType={logType} />
  );
};

export default LogView;
