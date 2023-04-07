const fetchStream = async (url: string, abortController?: AbortController) => {
  const response = await fetch(url, {
    credentials: "include",
    signal: abortController ? abortController.signal : undefined,
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
        while (true) {
          // eslint-disable-next-line no-await-in-loop
          const { done, value } = await reader.read();

          if (done) {
            controller.close();
            break;
          }

          controller.enqueue(value);
        }
      } catch (error) {
        console.log(error);
        controller.error(error);
      } finally {
        reader.releaseLock();
      }
    },
  });
};

const fetchLogFile = async (url: string) => {
  const stream = await fetchStream(url);
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
