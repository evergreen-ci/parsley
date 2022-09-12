import { useState } from "react";
import style from "@emotion/styled";
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
      <Container>
        {hasLogs ? (
          <LogWindow isUploadedLog logType={logType} />
        ) : (
          <FileDropper onChangeLogType={setLogType} />
        )}
      </Container>
    </PageLayout>
  );
};

const Container = style.div`
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
`;

export default LogDrop;
