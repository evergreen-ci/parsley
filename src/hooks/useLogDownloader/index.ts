import { useEffect, useState } from "react";
import { useLoadingPageAnalytics } from "analytics/loadingPage/useLoadingPageAnalytics";
import { LogTypes } from "constants/enums";
import { isProduction } from "utils/environmentVariables";
import { leaveBreadcrumb, reportError } from "utils/errorReporting";
import { processLogString } from "utils/string";

/**
 * `useLogDownloader` is a custom hook that downloads a log file from a given URL.
 * It downloads the log file and splits the log file into an array of strings.
 * Each string is split based on the newline character.
 * It returns an object with the following properties:
 * - isLoading: a boolean that is true while the log is being downloaded
 * - data: the log file as an array of strings
 * - error: an error message if the download fails
 *
 */
const useLogDownloader = (url: string, logType: LogTypes) => {
  const [data, setData] = useState<string[] | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const { sendEvent } = useLoadingPageAnalytics();
  useEffect(() => {
    leaveBreadcrumb("useLogDownloader", { url }, "request");
    const req = new Request(url, { method: "GET" });
    const abortController = new AbortController();
    const timeStart = Date.now();
    fetch(req, {
      credentials: "include",
      // Conditionally define signal because AbortController throws error in development's strict mode
      signal: isProduction ? abortController.signal : undefined,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`downloading log: ${response.status}`);
        }
        return response;
      })
      .then((response) => response.text() || "")
      .then((text) => {
        setData(processLogString(text));
        sendEvent({
          name: "Log Downloaded",
          duration: Date.now() - timeStart,
          type: logType,
        });
      })
      .catch((err: Error) => {
        leaveBreadcrumb("useLogDownloader", { url, err }, "error");
        reportError(err).severe();
        setError(err.message);
      })
      .finally(() => {
        leaveBreadcrumb(
          "useLogDownloader",
          { url, time: Date.now() - timeStart },
          "request"
        );

        setIsLoading(false);
      });
    return () => {
      // Cancel the request if the component unmounts
      abortController.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);
  return { data, error, isLoading };
};

export { useLogDownloader };
