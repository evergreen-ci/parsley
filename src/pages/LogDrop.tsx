import LogWindow from "components/LogWindow";
import { LogTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import FileDropper from "./LogDrop/FileDropper";

const LogDrop = () => {
  const { hasLogs } = useLogContext();

  return hasLogs ? (
    <LogWindow logType={LogTypes.LOCAL_UPLOAD} />
  ) : (
    <FileDropper />
  );
};

export default LogDrop;
