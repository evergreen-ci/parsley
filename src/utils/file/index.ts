import { SentryBreadcrumb, leaveBreadcrumb } from "utils/errorReporting";

type StreamedFileOptions = {
  fileSizeLimit?: number;
};

/**
 * `fileToStream` is a utility function that converts a File object into a ReadableStream
 * @param file - File to convert to a stream
 * @param options - an object containing options for the stream
 * @param options.fileSizeLimit - the maximum number of bytes to stream
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
              leaveBreadcrumb(
                "File size limit exceeded",
                { bytesRead },
                SentryBreadcrumb.UI
              );
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

export { fileToStream };
