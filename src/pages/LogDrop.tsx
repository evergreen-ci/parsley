import LogWindow from "components/LogWindow";
import { LogTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import FileDropper from "./LogDrop/FileDropper";

const LogDrop = () => {
  const { hasLogs, logMetadata } = useLogContext();

  return hasLogs ? (
    <LogWindow
      isUploadedLog
      logType={logMetadata?.logType || LogTypes.RESMOKE_LOGS}
    />
  ) : (
    <FileDropper />
  );
};

export default LogDrop;
