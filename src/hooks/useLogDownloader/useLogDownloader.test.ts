import { renderHook } from "@testing-library/react-hooks";
import { useLogDownloader } from ".";

const API_URL = "/some/endpoint";

const textMessage =
  "Fetched a multiline log file\nSome more lines\nAnd some more";

// Fetch is not supported in jest so we need to mock it out
describe("useLogDownloader", () => {
  it("gets a good response from the api and updates its state", async () => {
    const mockFetchPromise = Promise.resolve({
      ok: true,
      text: () => Promise.resolve(textMessage),
    });
    // eslint-disable-next-line jest/prefer-spy-on -- we want to mock the global fetch and we can't spy on it
    global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);

    const { result, waitForNextUpdate } = renderHook(() =>
      useLogDownloader(API_URL)
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
    const mockFetchPromise = Promise.reject(new Error("Something went wrong"));
    // eslint-disable-next-line jest/prefer-spy-on -- we want to mock the global fetch and we can't spy on it
    global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);

    const { result, waitForNextUpdate } = renderHook(() =>
      useLogDownloader(API_URL)
    );
    expect(result.current.isLoading).toBe(true);
    await waitForNextUpdate();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe("Something went wrong");
  });
});
