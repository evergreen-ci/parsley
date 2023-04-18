enum IncompleteDownloadReason {
  ServerError = "SERVER_ERROR",
  FileTooLarge = "FILE_TOO_LARGE",
}

export type StreamedFetchOptions = {
  abortController?: AbortController;
  onProgress?: (progress: number) => void;
  onIncompleteDownload?: (
    reason: IncompleteDownloadReason,
    error?: Error
  ) => void;
  downloadSizeLimit?: number;
};
/**
 * `streamedFetch` is a utility function that exposes a `ReadableStream` from
 * the response body of a `fetch` request. This allows us to stream the response
 * body and process it as it comes in, rather than waiting for the entire response.
 * @param url - the url to fetch
 * @param options - an object containing options for the fetch request
 * @param options.abortController - an AbortController that can be used to cancel the request
 * @param options.onProgress - a callback that will be called with the number of bytes received
 * @param options.onIncompleteDownload - a callback that will be called if the download is incomplete
 * @param options.downloadSizeLimit - the maximum number of bytes to download
 * @returns a `ReadableStream` from the response body
 */
const streamedFetch = async (url: string, options: StreamedFetchOptions) => {
  const response = await fetch(url, {
    credentials: "include",
    signal: options.abortController
      ? options.abortController.signal
      : undefined,
  });

  if (!response.ok) {
    throw new Error(`Network response was not ok (${response.status})`);
  }

  if (!response.body) {
    throw new Error("Network response has no body");
  }

  const reader = response.body.getReader();

  let bytesFetched = 0;

  return new ReadableStream({
    async start(controller) {
      try {
        // eslint-disable-next-line no-constant-condition -- while(true) is the only way to stream
        while (true) {
          if (options?.downloadSizeLimit) {
            // If we've hit the file size limit, stop streaming and close the stream
            if (bytesFetched > options.downloadSizeLimit) {
              options?.onIncompleteDownload?.(
                IncompleteDownloadReason.FileTooLarge
              );
              controller.close();
              break;
            }
          }
          // eslint-disable-next-line no-await-in-loop
          const { done, value } = await reader.read();
          if (done) {
            controller.close();
            break;
          }
          options?.onProgress?.(value?.length ?? 0);
          bytesFetched += value?.length ?? 0;

          controller.enqueue(value);
        }
      } catch (error) {
        // If we hit an error, but we've already fetched some bytes, then we can assume that
        // the download was incomplete. This is because the controller will close the connection with an error if
        // we hit the timeout, we should instead return the bytes we've fetched so far.
        if (bytesFetched > 0) {
          options?.onIncompleteDownload?.(
            IncompleteDownloadReason.ServerError,
            error as Error
          );
          controller.close();
        } else {
          controller.error(error);
        }
      } finally {
        reader.releaseLock();
      }
    },
  });
};

/**
 * `fetchLogFile` is a utility function that fetches a log file from the server
 * and returns it as an array of strings, one for each line. It uses `streamedFetch`
 * to stream the response body and process it as it comes in. This allows us to
 * avoid loading the entire log file into memory.
 * @param url - the url to fetch
 * @param options - an object containing options for the fetch request
 * @param options.abortController - an AbortController that can be used to cancel the request
 * @param options.onProgress - a callback that will be called with the number of bytes received
 * @returns an array of strings, one for each line in the log file
 */
const fetchLogFile = async (url: string, options: StreamedFetchOptions) => {
  const stream = await streamedFetch(url, options);
  const decoder = new TextDecoder();
  const reader = stream.getReader();
  const result: string[] = [];

  // eslint-disable-next-line no-constant-condition -- while(true) is the only way to stream
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const { done, value } = await reader.read();
    if (done) {
      return result;
    }

    const chunk = decoder.decode(value, { stream: !done });
    const lines = chunk.split(/\r?\n/);

    if (result.length > 0) {
      // Find the last line we've received so far
      const lastIndex = result.length - 1;
      const lastLine = result[lastIndex];
      // Concatenate the last line with the first line of the "lines" array
      result[lastIndex] = lastLine + lines[0];
      // Remove the first line from the "lines" array

      lines.shift();
    }

    result.push(...lines);
  }
};

export { streamedFetch, fetchLogFile };
