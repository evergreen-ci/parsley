import { renderHook } from "@testing-library/react-hooks";
import { LogTypes } from "constants/enums";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import { useLogDownloader } from ".";

const API_URL = "/some/endpoint";

const textMessage =
  "Fetched a multiline log file\nSome more lines\nAnd some more";

describe("useLogDownloader", () => {
  const mockFetch = jest.fn();

  beforeEach(() => {
    global.fetch = mockFetch;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("gets a good response from the log source and returns the array of log lines", async () => {
    const readableStream = createReadableStream([textMessage]);

    const response = new Response(readableStream, { status: 200 });
    // @ts-expect-error
    response.body = readableStream;

    mockFetch.mockResolvedValue(response);

    // RenderFakeToastContext is a mock of the ToastContext
    RenderFakeToastContext();
    const { result, waitForNextUpdate } = renderHook(() =>
      useLogDownloader(API_URL, LogTypes.RESMOKE_LOGS)
    );
    expect(result.current.isLoading).toBe(true);
    await waitForNextUpdate();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toStrictEqual([
      "Fetched a multiline log file",
      "Some more lines",
      "And some more",
    ]);
  });
  it("gets a bad response from the api and returns an error", async () => {
    const mockFetchPromise = jest
      .fn()
      .mockRejectedValue(new Error("Something went wrong"));
    jest.spyOn(global, "fetch").mockImplementation(mockFetchPromise);

    // RenderFakeToastContext is a mock of the ToastContext
    RenderFakeToastContext();
    const { result, waitForNextUpdate } = renderHook(() =>
      useLogDownloader(API_URL, LogTypes.EVERGREEN_TASK_LOGS)
    );
    expect(result.current.isLoading).toBe(true);
    await waitForNextUpdate();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe("Something went wrong");
  });
  it("should update the progress bar as the log is downloaded", async () => {
    const readableStream = createReadableStream(["chunk1", "chunk2"]);

    const response = new Response(readableStream, { status: 200 });
    // @ts-expect-error
    response.body = readableStream;

    mockFetch.mockResolvedValue(response);

    // RenderFakeToastContext is a mock of the ToastContext
    RenderFakeToastContext();
    const { result, waitForNextUpdate } = renderHook(() =>
      useLogDownloader(API_URL, LogTypes.RESMOKE_LOGS)
    );
    expect(result.current.isLoading).toBe(true);
    expect(result.current.fileSize).toBe(0);
    await waitForNextUpdate();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.fileSize).toBe(12);
  });
  it("should remove the last log line if it is empty", async () => {
    const readableStream = createReadableStream(["chunk1\n", "chunk2\n", ""]);

    const response = new Response(readableStream, { status: 200 });
    // @ts-expect-error
    response.body = readableStream;

    mockFetch.mockResolvedValue(response);

    // RenderFakeToastContext is a mock of the ToastContext
    RenderFakeToastContext();
    const { result, waitForNextUpdate } = renderHook(() =>
      useLogDownloader(API_URL, LogTypes.RESMOKE_LOGS)
    );
    expect(result.current.isLoading).toBe(true);
    await waitForNextUpdate();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toStrictEqual(["chunk1", "chunk2"]);
  });

  it("should throw a FILE_TOO_LARGE error if the file is too large and only download the file partially", async () => {
    const readableStream = createReadableStream(["chunk1\n", "chunk2\n"]);

    const response = new Response(readableStream, { status: 200 });
    // @ts-expect-error
    response.body = readableStream;

    mockFetch.mockResolvedValue(response);

    // RenderFakeToastContext is a mock of the ToastContext
    const { dispatchToast } = RenderFakeToastContext();
    const { result, waitForNextUpdate } = renderHook(() =>
      useLogDownloader(API_URL, LogTypes.RESMOKE_LOGS, 5)
    );
    expect(result.current.isLoading).toBe(true);
    await waitForNextUpdate();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toStrictEqual(["chunk1"]);
    expect(dispatchToast.warning).toHaveBeenCalledWith(
      "We were only able to partially download this log. Use the Evergreen CLI command in the details menu to download the log on to your machine.",
      true,
      { title: "Log not fully downloaded" }
    );
  });
});

const createReadableStream = (chunks: string[]) => {
  const encoder = new TextEncoder();
  const encodedChunks = chunks.map((chunk) => encoder.encode(chunk));
  const readableStream = new ReadableStream({
    start(controller) {
      encodedChunks.forEach((chunk) => controller.enqueue(chunk));
      controller.close();
    },
  });
  return readableStream;
};
