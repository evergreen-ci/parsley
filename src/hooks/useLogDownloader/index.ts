import { useEffect, useState } from "react";
import { useLogDownloadAnalytics } from "analytics";
import { LogTypes } from "constants/enums";
import { LOG_FILE_SIZE_LIMIT } from "constants/logs";
import { useToastContext } from "context/toast";
import useStateRef from "hooks/useStateRef";
import { isProduction } from "utils/environmentVariables";
import { leaveBreadcrumb, reportError } from "utils/errorReporting";
import { fetchLogFile } from "utils/fetchLogFile";
import { getBytesAsString } from "utils/string";

/**
 * `useLogDownloader` is a custom hook that downloads a log file from a given URL.
 * It uses a fetch stream to download the log file and splits the log file into an array of strings.
 * Each string is split based on the newline character.
 * It returns an object with the following properties:
 * - isLoading: a boolean that is true while the log is being downloaded
 * - data: the log file as an array of strings
 * - error: an error message if the download fails
 * - fileSize: the size of the log file in bytes
 */
const useLogDownloader = (
  url: string,
  logType: LogTypes,
  downloadSizeLimit: number = LOG_FILE_SIZE_LIMIT
) => {
  const [data, setData] = useState<string[] | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [fileSize, setFileSize, getFileSize] = useStateRef<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const { sendEvent } = useLogDownloadAnalytics();
  const dispatchToast = useToastContext();

  useEffect(() => {
    leaveBreadcrumb("useLogDownloader", { url }, "request");
    const abortController = new AbortController();
    const timeStart = Date.now();

    fetchLogFile(url, {
      // Conditionally define signal because AbortController throws error in development's strict mode
      abortController: isProduction ? abortController : undefined,
      onProgress: (progress) => {
        setFileSize(getFileSize() + progress);
      },
      downloadSizeLimit,
      onIncompleteDownload: (reason, incompleteDownloadError) => {
        leaveBreadcrumb(
          "useLogDownloader",
          { incompleteDownloadError, reason },
          "error"
        );
        dispatchToast.warning(
          "Parsley was only able to partially download this log. Use the Evergreen CLI command in the details menu to download the log onto your machine.",
          true,
          {
            title: "Log not fully downloaded",
          }
        );
      },
    })
      .then((logs) => {
        // Remove the last log line if it is empty
        if (logs[logs.length - 1] === "") {
          logs.pop();
        }
        setData(logs);
      })
      .catch((err: Error) => {
        leaveBreadcrumb("useLogDownloader", { url, err }, "error");
        reportError(err).severe();
        setError(err.message);
        sendEvent({
          name: "Log Download Failed",
          duration: Date.now() - timeStart,
          type: logType,
          fileSize: getFileSize(),
        });
      })
      .finally(() => {
        leaveBreadcrumb(
          "useLogDownloader",
          {
            url,
            time: Date.now() - timeStart,
            fileSize: getBytesAsString(getFileSize()),
          },
          "request"
        );
        sendEvent({
          name: "Log Downloaded",
          duration: Date.now() - timeStart,
          type: logType,
          fileSize: getFileSize(),
        });
        setIsLoading(false);
      });

    return () => {
      // Cancel the request if the component unmounts
      abortController.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);
  return { data, error, isLoading, fileSize };
};

export { useLogDownloader };
