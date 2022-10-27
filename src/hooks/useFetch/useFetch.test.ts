import { renderHook } from "@testing-library/react-hooks";
import { useFetch } from ".";

const API_URL = "/some/endpoint";
const jsonMessage = {
  key: "value",
  anotherKey: "anotherValue",
  someNumber: 123,
};
describe("useFetch", () => {
  it("gets a good response from the api and updates its state", async () => {
    const mockFetchPromise = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(jsonMessage),
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
});
