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

type StreamedFileOptions = {
  fileSizeLimit?: number;
};
/**
 * `fileToStream` is a utility function that converts a File object into a ReadableStream
 * @param file - File to convert to a stream
 * @returns a ReadableStream
 */
const fileToStream = async (
  file: File,
  options: StreamedFileOptions = {}
): Promise<ReadableStream<ArrayBuffer>> => {
  let bytesRead = 0;
  const stream = new ReadableStream<ArrayBuffer>({
    start(controller) {
      const fileReader = new FileReader();

      fileReader.onload = () => {
        let byteOffset = 0;

        if (fileReader.result instanceof ArrayBuffer) {
          // Split the array buffer into chunks and enqueue them to the controller
          while (byteOffset < fileReader.result.byteLength) {
            const chunk = fileReader.result.slice(
              byteOffset,
              byteOffset + CHUNK_SIZE
            );
            controller.enqueue(chunk);
            byteOffset += CHUNK_SIZE;
            bytesRead += CHUNK_SIZE;
            if (options.fileSizeLimit && bytesRead > options.fileSizeLimit) {
              controller.close();
              break;
            }
          }
          controller.close();
        }
      };

      fileReader.readAsArrayBuffer(file);
    },
  });
  return stream;
};

const CHUNK_SIZE = 1024 * 1024 * 10; // 10MB

export { arrayBufferToStringArray, fileToStream };
