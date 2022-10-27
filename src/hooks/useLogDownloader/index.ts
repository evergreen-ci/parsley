import { useEffect, useState } from "react";
import { isProduction } from "utils/environmentVariables";
import { leaveBreadcrumb } from "utils/errorReporting";
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
const useLogDownloader = (url: string) => {
  const [data, setData] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    leaveBreadcrumb("useLogDownloader", { url }, "request");
    const req = new Request(url, { method: "GET" });
    const abortController = new AbortController();

    fetch(req, {
      credentials: "include",
      // Conditionally define signal because AbortController throws error in development's strict mode
      signal: isProduction ? abortController.signal : undefined,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response;
      })
      .then((response) => response.text() || "")
      .then((text) => {
        setData(text.trimEnd().split("\n"));
      })
      .catch((err: Error) => {
        leaveBreadcrumb("useLogDownloader", { url, err }, "error");
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
    return () => {
      // Cancel the request if the component unmounts
      abortController.abort();
    };
  }, [url]);
  return { data, error, isLoading };
};

export { useLogDownloader };
