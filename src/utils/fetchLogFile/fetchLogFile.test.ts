import { StreamedFetchOptions, fetchLogFile } from ".";

describe("fetchLogFile", () => {
  const mockFetch = jest.fn();
  const mockAbortController = new AbortController();

  const options: StreamedFetchOptions = {
    abortController: mockAbortController,
  };
  const url = "https://example.com/test.log";

  beforeEach(() => {
    global.fetch = mockFetch;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch the log file and return it as an array of strings", async () => {
    const readableStream = createReadableStream(["Hello\nWorld"]);

    const response = new Response(readableStream, { status: 200 });
    // @ts-expect-error
    response.body = readableStream;

    mockFetch.mockResolvedValue(response);

    const result = await fetchLogFile(url, options);

    expect(mockFetch).toHaveBeenCalledWith(url, {
      credentials: "include",
      signal: options.abortController?.signal,
    });
    expect(result).toStrictEqual(["Hello", "World"]);
  });

  it("should throw an error if the network response is not ok", async () => {
    const response = new Response(null, { status: 404 });

    mockFetch.mockResolvedValue(response);

    await expect(fetchLogFile(url, options)).rejects.toThrow(
      "Network response was not ok (404)"
    );
  });

  it("should throw an error if the network response has no body", async () => {
    const response = new Response(null, { status: 200 });

    mockFetch.mockResolvedValue(response);

    await expect(fetchLogFile(url, options)).rejects.toThrow(
      "Network response has no body"
    );
  });

  it("should call onProgress with the number of bytes received", async () => {
    const readableStream = createReadableStream(["Hello", " World"]);
    const response = new Response(readableStream, { status: 200 });
    // @ts-expect-error
    response.body = readableStream;

    mockFetch.mockResolvedValue(response);
    const mockOnProgress = jest.fn();
    await fetchLogFile(url, { ...options, onProgress: mockOnProgress });

    expect(mockOnProgress).toHaveBeenCalledTimes(2);
    expect(mockOnProgress).toHaveBeenCalledWith(5);
    expect(mockOnProgress).toHaveBeenCalledWith(6);
  });

  it("should ensure partial lines in chunks are not split and are returned as a single line", async () => {
    let readableStream = createReadableStream(["Hello W", "orld"]);
    let response = new Response(readableStream, { status: 200 });
    // @ts-expect-error
    response.body = readableStream;

    mockFetch.mockResolvedValue(response);

    let result = await fetchLogFile(url, options);

    expect(result).toStrictEqual(["Hello World"]);

    readableStream = createReadableStream([
      "Hello W",
      "orld!\n",
      "This is a test",
      "\nof the emergency broadcast system",
    ]);
    response = new Response(readableStream, { status: 200 });
    // @ts-expect-error
    response.body = readableStream;

    mockFetch.mockResolvedValue(response);

    result = await fetchLogFile(url, options);

    expect(result).toStrictEqual([
      "Hello World!",
      "This is a test",
      "of the emergency broadcast system",
    ]);
  });

  it("should call onIncompleteDownload if the log file is not fully downloaded", async () => {
    const readableStream = createReadableStream(["Hello", " W"]);
    const response = new Response(readableStream, { status: 200 });
    // @ts-expect-error
    response.body = readableStream;

    mockFetch.mockResolvedValue(response);
    const mockOnIncompleteDownload = jest.fn();
    const result = await fetchLogFile(url, {
      ...options,
      onIncompleteDownload: mockOnIncompleteDownload,
      downloadSizeLimit: 4,
    });

    expect(mockOnIncompleteDownload).toHaveBeenCalledWith("FILE_TOO_LARGE");
    expect(result).toStrictEqual(["Hello"]);
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
