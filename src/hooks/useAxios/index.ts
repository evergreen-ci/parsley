import { useEffect, useState } from "react";
import { leaveBreadcrumb } from "utils/errorReporting";

const useAxiosGet = (url: string) => {
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [data, setData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    leaveBreadcrumb("useAxiosGet", { url }, "request");
    const req = new Request(url, { method: "GET" });
    const abortController = new AbortController();

    fetch(req, { credentials: "include" })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        let downloaded = 0;

        const reader = response.body?.getReader();
        if (reader !== undefined) {
          const stream = new ReadableStream({
            start(controller) {
              return pump();
              async function pump(): Promise<any> {
                const { done, value } = (await reader?.read()) || {
                  done: true,
                  value: null,
                };
                if (done) {
                  controller.close();
                  return;
                }
                downloaded += value.length;
                setDownloadProgress(downloaded / 1024);

                controller.enqueue(value);
                return pump();
              }
            },
          });
          return new Response(stream, {
            headers: { "Content-Type": "text/plain" },
          });
        }
      })
      .then((response) => response?.text() || "")
      .then((text) => {
        console.timeEnd("useAxiosGet");
        setData(text);
      })
      .catch((err: Error) => {
        leaveBreadcrumb("useAxiosGet", { url, err }, "error");
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
    return () => {
      abortController.abort();
    };
  }, [url]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return { data, error, isLoading, downloadProgress };
};

export { useAxiosGet };
