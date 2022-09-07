import { useState } from "react";
import { LogTypes } from "constants/enums";
import LoadingPage from "./LoadingPage";
import { LogWindow } from "./LogView/index";

interface LogViewProps {
  logType: LogTypes;
}

const LogView: React.FC<LogViewProps> = ({ logType }) => {
  const [isLoading, setIsLoading] = useState(true);

  return isLoading ? (
    <LoadingPage logType={logType} onLoad={() => setIsLoading(false)} />
  ) : (
    <LogWindow logType={logType} />
  );
};

export default LogView;
