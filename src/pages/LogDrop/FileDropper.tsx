import { useCallback, useRef, useState } from "react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { useDropzone } from "react-dropzone";
import { useLogDropAnalytics } from "analytics";
import { LogTypes } from "constants/enums";
import { size } from "constants/tokens";
import { useLogContext } from "context/LogContext";
import { useToastContext } from "context/toast";
import { leaveBreadcrumb, reportError } from "utils/errorReporting";
import { fileToStream } from "utils/file";
import { decodeStream } from "utils/streams";
import FileSelector from "./FileSelector";
import ParseLogSelect from "./ParseLogSelect";

const { green } = palette;
interface FileDropperProps {
  onChangeLogType: (logType: LogTypes) => void;
}

const FileDropper: React.FC<FileDropperProps> = ({ onChangeLogType }) => {
  const dispatchToast = useToastContext();
  const { sendEvent } = useLogDropAnalytics();
  const { ingestLines, setFileName, logMetadata } = useLogContext();
  const { fileName } = logMetadata ?? {};

  const lineStream = useRef<string[]>(null);
  const [hasDroppedLog, setHasDroppedLog] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      leaveBreadcrumb("Dropped file", {}, "user");
      sendEvent({ name: "Dropped file" });
      try {
        (async () => {
          const stream = await fileToStream(acceptedFiles[0]);
          // @ts-expect-error
          lineStream.current = await decodeStream(stream);
          leaveBreadcrumb(
            "Decoded file",
            { fileSize: lineStream.current.length },
            "process"
          );
          setHasDroppedLog(true);
          setFileName(acceptedFiles[0].name);
        })();
      } catch (e) {
        reportError(new Error(`Failed to parse file: ${e}`)).severe();
        dispatchToast.error("Failed to parse file");
      }
    },
    [setFileName, dispatchToast, sendEvent]
  );

  const onParse = useCallback(
    (logType: LogTypes | undefined) => {
      if (logType) {
        onChangeLogType(logType);
        leaveBreadcrumb("Parsing file", { logType }, "process");
        sendEvent({
          name: "Processed Log",
          logType,
          fileSize: lineStream.current?.length,
        });
        if (Array.isArray(lineStream.current)) {
          ingestLines(lineStream.current, logType);
        }
      }
    },
    [ingestLines, sendEvent, onChangeLogType]
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
    noClick: true,
    noKeyboard: true,
  });

  return (
    <Container>
      <BorderBox>
        <Dropzone {...getRootProps()} data-cy="upload-zone">
          {hasDroppedLog ? (
            <ParseLogSelect
              disabled={!hasDroppedLog}
              fileName={fileName}
              onParse={onParse}
              setHasDroppedLog={setHasDroppedLog}
            />
          ) : (
            <FileSelector getInputProps={getInputProps} open={open} />
          )}
        </Dropzone>
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

const Dropzone = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${size.xl};
  width: 50vw;
  height: 30vh;
`;

export default FileDropper;
