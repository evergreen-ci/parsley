import { renderHook } from "@testing-library/react-hooks";
import { useFetch } from ".";

const API_URL = "/some/endpoint";
const jsonMessage = {
  anotherKey: "anotherValue",
  key: "value",
  someNumber: 123,
};
describe("useFetch", () => {
  it("gets a good response from the api and updates its state", async () => {
    const mockFetchPromise = jest.fn().mockResolvedValue({
      json: () => Promise.resolve(jsonMessage),
      ok: true,
    });
    jest.spyOn(global, "fetch").mockImplementation(mockFetchPromise);

    const { result, waitForNextUpdate } = renderHook(() => useFetch(API_URL));
    expect(result.current.isLoading).toBe(true);
    await waitForNextUpdate();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toStrictEqual(jsonMessage);
  });
  it("gets a bad response from the api and returns an error", async () => {
    const mockFetchPromise = jest
      .fn()
      .mockRejectedValue(new Error("Something went wrong"));
    jest.spyOn(global, "fetch").mockImplementation(mockFetchPromise);

    const { result, waitForNextUpdate } = renderHook(() => useFetch(API_URL));
    expect(result.current.isLoading).toBe(true);
    await waitForNextUpdate();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe("Something went wrong");
  });
  it("skips the fetch if the skip option is supplied", async () => {
    const fetch = jest.fn();
    jest.spyOn(global, "fetch").mockImplementation(fetch);
    const { result } = renderHook(() => useFetch(API_URL, { skip: true }));
    expect(fetch).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });
  it("makes a request if skip is changed from true to false", async () => {
    const mockFetchPromise = jest.fn().mockResolvedValue({
      json: () => Promise.resolve(jsonMessage),
      ok: true,
    });

    let skip = true;
    jest.spyOn(global, "fetch").mockImplementation(mockFetchPromise);
    const { rerender, result, waitForNextUpdate } = renderHook(() =>
      useFetch(API_URL, { skip })
    );
    expect(mockFetchPromise).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeNull();
    skip = false;
    rerender();
    expect(result.current.isLoading).toBe(true);
    await waitForNextUpdate();
    expect(mockFetchPromise).toHaveBeenCalledTimes(1);
  });
});
