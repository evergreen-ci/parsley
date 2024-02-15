import { useCallback, useTransition } from "react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { useDropzone } from "react-dropzone";
import { useLogDropAnalytics } from "analytics";
import { LogTypes, SupportedLogRenderingTypes } from "constants/enums";
import { LOG_LINE_TOO_LARGE_WARNING } from "constants/errors";
import { LOG_FILE_SIZE_LIMIT, LOG_LINE_SIZE_LIMIT } from "constants/logs";
import { size } from "constants/tokens";
import { useLogContext } from "context/LogContext";
import { useToastContext } from "context/toast";
import {
  SentryBreadcrumb,
  leaveBreadcrumb,
  reportError,
} from "utils/errorReporting";
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
  const { dispatch, state } = useLogDropState();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      leaveBreadcrumb("Dropped file", {}, SentryBreadcrumb.User);
      sendEvent({ name: "Dropped file" });
      dispatch({ file: acceptedFiles[0], type: "DROPPED_FILE" });
    },
    [dispatch, sendEvent],
  );

  const onParse = useCallback(
    (logType: LogTypes | undefined) => {
      if (logType) {
        setLogMetadata({
          isUploadedLog: true,
          logType,
          renderingType:
            logType === LogTypes.RESMOKE_LOGS
              ? SupportedLogRenderingTypes.Resmoke
              : SupportedLogRenderingTypes.Default,
        });
        leaveBreadcrumb("Parsing file", { logType }, SentryBreadcrumb.UI);
        dispatch({ type: "PARSE_FILE" });
        startTransition(() => {
          (async () => {
            if (state.file) {
              try {
                const stream = await fileToStream(state.file, {
                  fileSizeLimit: LOG_FILE_SIZE_LIMIT,
                });
                const { result: logLines, trimmedLines } = await decodeStream(
                  stream,
                  LOG_LINE_SIZE_LIMIT,
                );
                leaveBreadcrumb(
                  "Decoded file",
                  { fileSize: logLines.length },
                  SentryBreadcrumb.UI,
                );
                sendEvent({
                  fileSize: logLines?.length,
                  logType,
                  name: "Processed Log",
                });
                setFileName(state.file.name);
                ingestLines(logLines, logType);
                if (trimmedLines) {
                  dispatchToast.warning(LOG_LINE_TOO_LARGE_WARNING, true, {
                    shouldTimeout: false,
                    title: "Log not fully loaded",
                  });
                }
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
    ],
  );

  const { getInputProps, getRootProps, open } = useDropzone({
    maxFiles: 1,
    multiple: false,
    noClick: true,
    noKeyboard: true,
    onDrop,
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
