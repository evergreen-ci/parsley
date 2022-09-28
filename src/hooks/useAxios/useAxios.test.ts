import { renderHook } from "@testing-library/react-hooks";
import axios from "axios";
import { useAxiosGet } from ".";

const API_URL = "/some/endpoint";

const jsonMessage = "got JSON response";

const mockApi = {
  status: 200,
  statusText: "OK",
  data: jsonMessage,
};

jest.mock("axios");

describe("useAxiosGet", () => {
  const mockedAxiosGet = axios.get as jest.MockedFunction<typeof axios.get>;
  it("gets a good response from the api and updates its state", async () => {
    mockedAxiosGet.mockResolvedValue(mockApi);
    const { result, waitForNextUpdate } = renderHook(() =>
      useAxiosGet(API_URL)
    );
    expect(result.current.isLoading).toBe(true);
    await waitForNextUpdate();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBe(jsonMessage);
  });
  it("gets a bad response from the api and returns an error", async () => {
    mockedAxiosGet.mockRejectedValue({ status: 404, message: "error" });
    const { result, waitForNextUpdate } = renderHook(() =>
      useAxiosGet(API_URL)
    );
    expect(result.current.isLoading).toBe(true);
    await waitForNextUpdate();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe("error");
  });
});
