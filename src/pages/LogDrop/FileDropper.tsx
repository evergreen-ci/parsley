import { useCallback, useRef, useState } from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { palette } from "@leafygreen-ui/palette";
import { Option, Select } from "@leafygreen-ui/select";
import { Body, InlineCode, Label } from "@leafygreen-ui/typography";
import { useDropzone } from "react-dropzone";
import { useLogDropAnalytics } from "analytics";
import Icon from "components/Icon";
import { LogTypes } from "constants/enums";
import { size } from "constants/tokens";
import { useLogContext } from "context/LogContext";
import { useToastContext } from "context/toast";
import { leaveBreadcrumb } from "utils/errorReporting";
import { processLogString } from "utils/string";

const { green } = palette;
interface FileDropperProps {
  onChangeLogType: (logType: LogTypes) => void;
}

const FileDropper: React.FC<FileDropperProps> = ({ onChangeLogType }) => {
  const { ingestLines, setFileName, logMetadata } = useLogContext();
  const { fileName } = logMetadata ?? {};

  const dispatchToast = useToastContext();
  const { sendEvent } = useLogDropAnalytics();
  const [hasDroppedLog, setHasDroppedLog] = useState(false);
  const [logType, setLogType] = useState<LogTypes | undefined>(undefined);
  const lineStream = useRef<FileReader["result"]>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      leaveBreadcrumb("Dropped file", {}, "user");
      sendEvent({ name: "Dropped file" });
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();

        reader.onabort = () => dispatchToast.error("File reading was aborted.");
        reader.onerror = () => dispatchToast.error("File reading failed.");
        reader.onload = () => {
          setHasDroppedLog(true);
          setFileName(file.name);
          dispatchToast.success(`Successfully uploaded file: ${file.name}`);
          lineStream.current = reader.result;
        };
        reader.readAsText(file);
      });
    },
    [setFileName, dispatchToast, sendEvent]
  );

  const onParse = useCallback(() => {
    if (logType) {
      onChangeLogType(logType);
      leaveBreadcrumb("Parsing file", { logType }, "process");
      sendEvent({ name: "Processed Log", logType });
      if (typeof lineStream.current === "string") {
        ingestLines(processLogString(lineStream.current), logType);
      }
    }
  }, [ingestLines, logType, sendEvent, onChangeLogType]);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    maxFiles: 1,
    noClick: true,
    noKeyboard: true,
  });

  return (
    <Container>
      <BorderBox>
        <DropzoneWrapper {...getRootProps()} data-cy="upload-zone">
          {hasDroppedLog ? (
            <ProcessLogsContainer>
              <Label htmlFor="parse-log-select">
                How would you like to parse <InlineCode>{fileName}</InlineCode>?
              </Label>
              <Select
                aria-labelledby="parse-log-select"
                id="parse-log-select"
                onChange={(value) => setLogType(value as LogTypes)}
                value={logType}
              >
                <Option value={LogTypes.RESMOKE_LOGS}>Resmoke</Option>
                <Option value={LogTypes.EVERGREEN_TASK_LOGS}>Raw</Option>
              </Select>
              <ButtonContainer>
                <Button onClick={() => setHasDroppedLog(false)}>Cancel</Button>
                <Button
                  data-cy="process-log-button"
                  disabled={!logType}
                  onClick={onParse}
                  variant="primary"
                >
                  Process Log
                </Button>
              </ButtonContainer>
            </ProcessLogsContainer>
          ) : (
            <>
              <input {...getInputProps()} />
              <Dropzone>
                <Body weight="medium">
                  Drag and Drop a log file to view in Parsley
                </Body>
                <Body weight="medium">or</Body>
                <Button
                  leftGlyph={<Icon glyph="Upload" />}
                  onClick={(e) => {
                    e.stopPropagation();
                    open();
                  }}
                >
                  Select from Files
                </Button>
              </Dropzone>
            </>
          )}
        </DropzoneWrapper>
      </BorderBox>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const BorderBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: ${size.xxs} dashed ${green.base};
  border-radius: ${size.s};
`;

const DropzoneWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${size.xl};
  width: 50vw;
  height: 30vh;
`;

const ProcessLogsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: ${size.xs};
  width: 300px;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-self: flex-end;
  gap: ${size.xs};
`;

const Dropzone = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${size.xs};
`;

export default FileDropper;
