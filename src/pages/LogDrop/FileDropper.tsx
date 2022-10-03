import { useCallback, useRef, useState } from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { palette } from "@leafygreen-ui/palette";
import { Option, Select } from "@leafygreen-ui/select";
import { Body } from "@leafygreen-ui/typography";
import { useDropzone } from "react-dropzone";
import Icon from "components/Icon";
import { LogTypes } from "constants/enums";
import { size } from "constants/tokens";
import { useLogContext } from "context/LogContext";
import { useToastContext } from "context/toast";

const { red } = palette;
interface FileDropperProps {
  onChangeLogType: (logType: LogTypes) => void;
}

const FileDropper: React.FC<FileDropperProps> = ({ onChangeLogType }) => {
  const { ingestLines, setFileName } = useLogContext();
  const dispatchToast = useToastContext();

  const [hasDroppedLog, setHasDroppedLog] = useState(false);
  const [logType, setLogType] = useState<LogTypes | undefined>(undefined);
  const lineStream = useRef<FileReader["result"]>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();

        reader.onabort = () => dispatchToast.error("File reading was aborted.");
        reader.onerror = () => dispatchToast.error("File reading failed.");
        reader.onload = () => {
          setHasDroppedLog(true);
          setFileName(file.name);
          lineStream.current = reader.result;
        };
        reader.readAsText(file);
      });
    },
    [setFileName, dispatchToast]
  );

  const onParse = useCallback(() => {
    if (logType) {
      onChangeLogType(logType);
      if (typeof lineStream.current === "string") {
        ingestLines(lineStream.current.split("\n"), logType);
      }
    }
  }, [ingestLines, logType, onChangeLogType]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    maxFiles: 1,
  });

  return (
    <Container>
      <RedBorderBox>
        {hasDroppedLog ? (
          <ProcessLogsContainer>
            <Select
              label="How would you like to parse this log?"
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
          <UploadLogsContainer {...getRootProps()} data-cy="upload-zone">
            <input {...getInputProps()} />
            {isDragActive ? (
              <Body>Release to upload</Body>
            ) : (
              <Dropzone>
                <Body weight="medium">
                  Drag and Drop a log file to view in Lobster
                </Body>
                <Body weight="medium">or</Body>
                <Button leftGlyph={<Icon glyph="Upload" />} onClick={open}>
                  Select from Files
                </Button>
              </Dropzone>
            )}
          </UploadLogsContainer>
        )}
      </RedBorderBox>
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

const RedBorderBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50vw;
  height: 30vh;

  padding: ${size.xl};
  border: ${size.xxs} dashed ${red.base};
  border-radius: ${size.s};
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

const UploadLogsContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Dropzone = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${size.xs};
`;

export default FileDropper;
