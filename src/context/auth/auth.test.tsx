import * as router from "react-router";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { act, renderHook, waitFor } from "test_utils";
import { mockEnvironmentVariables } from "test_utils/utils";
import { evergreenURL, graphqlURL } from "utils/environmentVariables";
import { AuthProvider, useAuthContext } from ".";

const { cleanup, mockEnv } = mockEnvironmentVariables();

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter initialEntries={["/"]}>
    <AuthProvider>
      <Routes>
        <Route element={null} path="/login" />
        <Route element={children} path="/" />
      </Routes>
    </AuthProvider>
  </MemoryRouter>
);

describe("auth", () => {
  const checkLoginFetchParams = {
    body: JSON.stringify({ query: `query { user { userId } }` }),
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    method: "POST",
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
    jest.restoreAllMocks();
    cleanup();
  });

  it("should error when rendered outside of AuthProvider", () => {
    const errorObject = console.error;
    jest.spyOn(console, "error").mockImplementation();
    expect(() => renderHook(() => useAuthContext())).toThrow(
      "useAuthContext must be used within an AuthProvider",
    );
    console.error = errorObject;
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

    const { result } = renderHook(() => useAuthContext(), {
      wrapper,
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(graphqlURL, checkLoginFetchParams);
    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });
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

      const { result } = renderHook(() => useAuthContext(), {
        wrapper,
      });

      result.current.devLogin({ password: "password", username: "username" });
      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });
    });

    it("should not authenticate when the response is unsuccessful", async () => {
      const mockFetchPromise = jest.fn().mockResolvedValue({ ok: false });
      jest.spyOn(global, "fetch").mockImplementation(mockFetchPromise);

      const { result } = renderHook(() => useAuthContext(), {
        wrapper,
      });

      result.current.devLogin({ password: "password", username: "username" });
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe("logoutAndRedirect", () => {
    it("should redirect to the Parsley /login page locally", async () => {
      mockEnv("NODE_ENV", "development");
      const mockFetchPromise = jest.fn().mockResolvedValue({});
      jest.spyOn(global, "fetch").mockImplementation(mockFetchPromise);
      const mockNavigate = jest.fn();
      jest.spyOn(router, "useNavigate").mockImplementation(() => mockNavigate);

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await act(async () => {
        result.current.logoutAndRedirect();
      });
      expect(result.current.isAuthenticated).toBe(false);
      expect(mockNavigate).toHaveBeenCalledWith("/login");
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
