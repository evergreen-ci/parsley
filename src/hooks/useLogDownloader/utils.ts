type Options = {
  abortController?: AbortController;
  onProgress?: (progress: number) => void;
};
/**
 * `streamedFetch` is a utility function that exposes a `ReadableStream` from
 * the response body of a `fetch` request. This allows us to stream the response
 * body and process it as it comes in, rather than waiting for the entire response.
 * @param url - the url to fetch
 * @param options - an object containing options for the fetch request
 * @param options.abortController - an AbortController that can be used to cancel the request
 * @param options.onProgress - a callback that will be called with the number of bytes received
 * @returns a `ReadableStream` from the response body
 */
const streamedFetch = async (url: string, options: Options) => {
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

  return new ReadableStream({
    async start(controller) {
      try {
        // eslint-disable-next-line no-constant-condition -- while(true) is the only way to stream
        while (true) {
          // eslint-disable-next-line no-await-in-loop
          const { done, value } = await reader.read();
          options?.onProgress?.(value?.length ?? 0);
          if (done) {
            controller.close();
            break;
          }

          controller.enqueue(value);
        }
      } catch (error) {
        controller.error(error);
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
const fetchLogFile = async (url: string, options: Options) => {
  const stream = await streamedFetch(url, options);
  const decoder = new TextDecoder();
  const reader = stream.getReader();
  const result: string[] = [];

  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const { done, value } = await reader.read();

    if (done) {
      return result;
    }

    const chunk = decoder.decode(value, { stream: !done });
    const lines = chunk.split(/\r?\n/);

    // If there was a partial line at the end of the previous chunk,
    // prepend it to the first line of this chunk.
    if (result.length > 0) {
      const lastIndex: number = result.length - 1;
      const lastLine = result[lastIndex];
      result[lastIndex] = lastLine + lines[0];
      lines.shift();
    }

    result.push(...lines);
  }
};

export { fetchLogFile };
