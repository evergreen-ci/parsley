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

  return hasDroppedLog ? (
    <Container>
      <StyledSelect
        label="How would you like to parse this log?"
        onChange={(value) => setLogType(value as LogTypes)}
        value={logType}
      >
        <Option value={LogTypes.RESMOKE_LOGS}>Resmoke</Option>
        <Option value={LogTypes.EVERGREEN_TASK_LOGS}>Raw</Option>
      </StyledSelect>
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
    </Container>
  ) : (
    <Container {...getRootProps()} data-cy="upload-zone">
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
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 60%;
  max-height: 250px;
  height: 60%;
  justify-content: center;
  align-items: center;
  border: ${size.xxs} dashed ${red.base};
  border-radius: ${size.s};
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${size.xs};
  button {
    margin: 0 ${size.xs};
  }
`;
const Dropzone = styled.div`
  display: flex;
  flex-direction: column;
  width: 60%;
  justify-content: center;
  align-items: center;
  > * {
    margin-bottom: ${size.xs};
  }
`;

// @ts-expect-error
const StyledSelect = styled(Select)`
  margin-bottom: ${size.xs};
`;
export default FileDropper;
