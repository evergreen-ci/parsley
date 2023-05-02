const arrayBufferToStringArray = (buffer: ArrayBuffer): string[] => {
  console.time("arrayBufferToStringArray");
  console.time("arrayBufferToStringArray:DataView");
  const decoder = new TextDecoder();
  // dataView is used to read the array buffer byte by byte
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView
  const view = new DataView(buffer);
  const lines: string[] = [];
  let line = "";

  console.timeEnd("arrayBufferToStringArray:DataView");
  console.time("arrayBufferToStringArray:for");
  for (let i = 0; i < view.byteLength; i++) {
    const charCode = view.getUint8(i);
    if (charCode === 10 || charCode === 13) {
      if (line) {
        lines.push(line);
        line = "";
      }
    } else {
      line += decoder.decode(new Uint8Array([charCode]));
    }
  }

  console.timeEnd("arrayBufferToStringArray:for");
  // If the last line doesn't end with a newline, we need to add it to the array
  if (line) {
    lines.push(line);
  }
  console.timeEnd("arrayBufferToStringArray");
  return lines;
};

/**
 * `fileToStream` is a utility function that converts a File object into a ReadableStream
 * @param file - File to convert to a stream
 * @returns a ReadableStream
 */
const fileToStream = async (
  file: File
): Promise<ReadableStream<ArrayBuffer>> => {
  const stream = new ReadableStream<ArrayBuffer>({
    start(controller) {
      const fileReader = new FileReader();

      fileReader.onload = () => {
        if (fileReader.result instanceof ArrayBuffer) {
          controller.enqueue(fileReader.result);
          controller.close();
        }
      };

      fileReader.readAsArrayBuffer(file);
    },
  });
  return stream;
};

export { arrayBufferToStringArray, fileToStream };
