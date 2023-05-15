import { useCallback, useTransition } from "react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { useDropzone } from "react-dropzone";
import { useLogDropAnalytics } from "analytics";
import { LogTypes } from "constants/enums";
import { LOG_FILE_SIZE_LIMIT } from "constants/logs";
import { size } from "constants/tokens";
import { useLogContext } from "context/LogContext";
import { useToastContext } from "context/toast";
import { leaveBreadcrumb, reportError } from "utils/errorReporting";
import { fileToStream } from "utils/file";
import { decodeStream } from "utils/streams";
import FileSelector from "./FileSelector";
import LoadingAnimation from "./LoadingAnimation";
import ParseLogSelect from "./ParseLogSelect";
import useLogDropState from "./state";

const { green } = palette;

const FileDropper: React.FC = () => {
  const dispatchToast = useToastContext();
  const { sendEvent } = useLogDropAnalytics();
  const { ingestLines, setFileName, setLogMetadata } = useLogContext();
  const [, startTransition] = useTransition();
  const { state, dispatch } = useLogDropState();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      leaveBreadcrumb("Dropped file", {}, "user");
      sendEvent({ name: "Dropped file" });
      dispatch({ type: "DROPPED_FILE", file: acceptedFiles[0] });
    },
    [dispatch, sendEvent]
  );

  const onParse = useCallback(
    (logType: LogTypes | undefined) => {
      if (logType) {
        setLogMetadata({ logType });
        leaveBreadcrumb("Parsing file", { logType }, "process");
        dispatch({ type: "PARSE_FILE" });
        startTransition(() => {
          (async () => {
            if (state.file) {
              try {
                const stream = await fileToStream(state.file, {
                  fileSizeLimit: LOG_FILE_SIZE_LIMIT,
                });
                const logLines = await decodeStream(stream);
                leaveBreadcrumb(
                  "Decoded file",
                  { fileSize: logLines.length },
                  "process"
                );
                sendEvent({
                  name: "Processed Log",
                  logType,
                  fileSize: logLines?.length,
                });
                setFileName(state.file.name);
                ingestLines(logLines, logType);
              } catch (e: any) {
                dispatchToast.error("An error occurred while parsing the log.");
                reportError(e).severe();
              }
            }
          })();
        });
      }
    },
    [
      setLogMetadata,
      dispatch,
      state.file,
      sendEvent,
      setFileName,
      ingestLines,
      dispatchToast,
    ]
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
    noClick: true,
    noKeyboard: true,
  });

  let visibleUI = null;

  switch (state.currentState) {
    case "WAITING_FOR_FILE":
      visibleUI = <FileSelector getInputProps={getInputProps} open={open} />;
      break;
    case "PROMPT_FOR_PARSING_METHOD":
      visibleUI = (
        <ParseLogSelect
          fileName={state.file?.name || ""}
          onCancel={() => dispatch({ type: "CANCEL" })}
          onParse={onParse}
        />
      );
      break;
    case "LOADING_FILE":
      visibleUI = <LoadingAnimation />;
      break;
    default:
      visibleUI = null;
      break;
  }

  return (
    <Container>
      <BorderBox>
        <Dropzone {...getRootProps()} data-cy="upload-zone">
          {visibleUI}
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
