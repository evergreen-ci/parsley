import { renderHook } from "@testing-library/react-hooks";
import { createMemoryHistory } from "history";
import {
  // Refer to https://reactrouter.com/docs/en/v6/routers/history-router to understand
  // why this import is marked as unstable.
  unstable_HistoryRouter as HistoryRouter,
  Route,
  Routes,
} from "react-router-dom";
import { waitFor } from "test_utils";
import { mockEnvironmentVariables } from "test_utils/utils";
import { evergreenURL, graphqlURL } from "utils/environmentVariables";
import { AuthProvider, useAuthContext } from ".";

const history = createMemoryHistory({ initialEntries: ["/"] });
const { mockEnv, cleanup } = mockEnvironmentVariables();

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <HistoryRouter history={history}>
    <AuthProvider>
      <Routes>
        <Route element={null} path="/login" />
        <Route element={children} path="/" />
      </Routes>
    </AuthProvider>
  </HistoryRouter>
);

describe("auth", () => {
  const checkLoginFetchParams = {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: `query { user { userId } }` }),
  };

  beforeEach(() => {
    Object.defineProperty(window, "location", {
      value: {
        href: "http://just-a-placeholder.com",
      },
      writable: true,
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("should error when rendered outside of AuthProvider", () => {
    const { result } = renderHook(() => useAuthContext());

    expect(result.error?.message).toBe(
      "useAuthContext must be used within an AuthProvider"
    );
  });

  it("should execute a query against GraphQL upon mount to check if user is authenticated", () => {
    const mockFetchPromise = jest.fn().mockResolvedValue({});
    jest.spyOn(global, "fetch").mockImplementation(mockFetchPromise);

    renderHook(() => useAuthContext(), { wrapper });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(graphqlURL, checkLoginFetchParams);
  });

  it("should authenticate the user if the GraphQL query succeeds", async () => {
    const mockFetchPromise = jest.fn().mockResolvedValue({ ok: true });
    jest.spyOn(global, "fetch").mockImplementation(mockFetchPromise);

    const { waitForNextUpdate, result } = renderHook(() => useAuthContext(), {
      wrapper,
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(graphqlURL, checkLoginFetchParams);
    await waitForNextUpdate();
    expect(result.current.isAuthenticated).toBe(true);
  });

  it("should not authenticate the user if the GraphQL query fails", async () => {
    const mockFetchPromise = jest.fn().mockResolvedValue({ ok: false });
    jest.spyOn(global, "fetch").mockImplementation(mockFetchPromise);

    const { result } = renderHook(() => useAuthContext(), {
      wrapper,
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(graphqlURL, checkLoginFetchParams);
    expect(result.current.isAuthenticated).toBe(false);
  });

  describe("devLogin", () => {
    it("should authenticate when the response is successful", async () => {
      const mockFetchPromise = jest.fn().mockResolvedValue({ ok: true });
      jest.spyOn(global, "fetch").mockImplementation(mockFetchPromise);

      const { waitForNextUpdate, result } = renderHook(() => useAuthContext(), {
        wrapper,
      });

      result.current.devLogin({ username: "username", password: "password" });
      await waitForNextUpdate();
      expect(result.current.isAuthenticated).toBe(true);
    });

    it("should not authenticate when the response is unsuccessful", async () => {
      const mockFetchPromise = jest.fn().mockResolvedValue({ ok: false });
      jest.spyOn(global, "fetch").mockImplementation(mockFetchPromise);

      const { result } = renderHook(() => useAuthContext(), {
        wrapper,
      });

      result.current.devLogin({ username: "username", password: "password" });
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe("logoutAndRedirect", () => {
    it("should redirect to the Parsley /login page locally", async () => {
      mockEnv("NODE_ENV", "development");
      const mockFetchPromise = jest.fn().mockResolvedValue({});
      jest.spyOn(global, "fetch").mockImplementation(mockFetchPromise);

      const { result } = renderHook(() => useAuthContext(), {
        wrapper,
      });

      result.current.logoutAndRedirect();
      expect(result.current.isAuthenticated).toBe(false);
      await waitFor(() => {
        expect(history.location.pathname).toBe("/login");
      });
    });

    it("should redirect to the Evergreen /login page otherwise", async () => {
      mockEnv("NODE_ENV", "production");
      const mockFetchPromise = jest.fn().mockResolvedValue({});
      jest.spyOn(global, "fetch").mockImplementation(mockFetchPromise);

      renderHook(() => useAuthContext(), {
        wrapper,
      });

      await waitFor(() => {
        expect(window.location.href).toBe(`${evergreenURL}/login`);
      });
    });
  });
});
