import { useState } from "react";
import LogWindow from "components/LogWindow";
import { LogTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import FileDropper from "./LogDrop/FileDropper";

const LogDrop = () => {
  const { hasLogs } = useLogContext();
  const [logType, setLogType] = useState(LogTypes.RESMOKE_LOGS);
  return hasLogs ? (
    <LogWindow isUploadedLog logType={logType} />
  ) : (
    <FileDropper onChangeLogType={setLogType} />
  );
};

export default LogDrop;
