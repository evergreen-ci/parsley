import { useState } from "react";
import LogWindow from "components/LogWindow";
import { PageLayout } from "components/styles";
import { LogTypes } from "constants/enums";
import LoadingPage from "./LogView/LoadingPage";

interface LogViewProps {
  logType: LogTypes;
}

const LogView: React.FC<LogViewProps> = ({ logType }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <PageLayout>
      {isLoading ? (
        <LoadingPage logType={logType} onLoad={() => setIsLoading(false)} />
      ) : (
        <LogWindow isUploadedLog={false} logType={logType} />
      )}
    </PageLayout>
  );
};

export default LogView;
