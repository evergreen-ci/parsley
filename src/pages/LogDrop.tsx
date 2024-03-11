import LogWindow from "components/LogWindow";
import { useLogContext } from "context/LogContext";
import FileDropper from "./LogDrop/FileDropper";

const LogDrop = () => {
  const { hasLogs } = useLogContext();

  return hasLogs ? <LogWindow /> : <FileDropper />;
};

export default LogDrop;
