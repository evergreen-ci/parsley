import { trimLogLineToMaxSize } from "utils/string";

/**
 * `decodeStream` is a helper function that takes a ReadableStream and returns a Promise that resolves to an array of strings.
 * @param stream - ReadableStream to decode
 * @param lineSizeLimit - the maximum length of a line
 * @returns a Promise that resolves to an array of strings
 */
const decodeStream = async (stream: ReadableStream, lineSizeLimit?: number) => {
  const decoder = new TextDecoder();
  const reader = stream.getReader();
  const result: string[] = [];
  let trimmedLines = false;

  // eslint-disable-next-line no-constant-condition -- while(true) is the only way to stream
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const { done, value } = await reader.read();
    if (done) {
      return { result, trimmedLines };
    }

    const chunk = decoder.decode(value, { stream: !done });
    const lines = chunk.split(/\r?\n/);

    if (lineSizeLimit !== undefined) {
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].length > lineSizeLimit) {
          trimmedLines = true;
          lines[i] = trimLogLineToMaxSize(lines[i], lineSizeLimit);
        }
      }
    }

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

export { decodeStream };
