import { useEffect, useState } from "react";
import { useLogDownloadAnalytics } from "analytics";
import { LogTypes } from "constants/enums";
import useStateRef from "hooks/useStateRef";
import { isProduction } from "utils/environmentVariables";
import { leaveBreadcrumb, reportError } from "utils/errorReporting";
import { formatBytes } from "utils/string";
import { fetchLogFile } from "./utils";

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
const useLogDownloader = (url: string, logType: LogTypes) => {
  const [data, setData] = useState<string[] | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [fileSize, setFileSize, getFileSize] = useStateRef<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const { sendEvent } = useLogDownloadAnalytics();
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
            fileSize: formatBytes(getFileSize()),
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
