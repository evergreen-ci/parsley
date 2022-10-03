import { useState } from "react";
import LogWindow from "components/LogWindow";
import { PageLayout } from "components/styles";
import { LogTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import FileDropper from "./LogDrop/FileDropper";

const LogDrop = () => {
  const { hasLogs } = useLogContext();
  const [logType, setLogType] = useState(LogTypes.RESMOKE_LOGS);
  return (
    <PageLayout>
      {hasLogs ? (
        <LogWindow isUploadedLog logType={logType} />
      ) : (
        <FileDropper onChangeLogType={setLogType} />
      )}
    </PageLayout>
  );
};

export default LogDrop;
