import { act } from "@testing-library/react-hooks";
import { renderWithRouterMatch as render, waitFor } from "test_utils";
import { mockEnvironmentVariables } from "test_utils/utils";
import { evergreenURL, graphqlURL } from "utils/environmentVariables";
import { AuthProvider, useAuthContext } from ".";

const { mockEnv, cleanup } = mockEnvironmentVariables();

const renderComponentWithHook = () => {
  const hook: { current: ReturnType<typeof useAuthContext> } = {
    current: {} as ReturnType<typeof useAuthContext>,
  };
  const Component: React.FC = () => {
    hook.current = useAuthContext();
    return null;
  };
  return {
    Component,
    hook,
  };
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    <div>{children}</div>
  </AuthProvider>
);

describe("auth", () => {
  const authenticationFetchParams = {
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
    const { Component } = renderComponentWithHook();
    expect(() => render(<Component />)).toThrow(
      "useAuthContext must be used within an AuthProvider"
    );
  });

  it("should execute a query against GraphQL upon mount to check if user is authenticated", () => {
    const mockFetchPromise = jest.fn().mockResolvedValue({});
    jest.spyOn(global, "fetch").mockImplementation(mockFetchPromise);

    const { Component } = renderComponentWithHook();
    render(<Component />, { wrapper });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(graphqlURL, authenticationFetchParams);
  });

  it("should authenticate the user if the GraphQL query succeeds", async () => {
    const mockFetchPromise = jest.fn().mockResolvedValue({ ok: true });
    jest.spyOn(global, "fetch").mockImplementation(mockFetchPromise);

    const { Component, hook } = renderComponentWithHook();
    render(<Component />, { wrapper });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(graphqlURL, authenticationFetchParams);
    await waitFor(() => {
      expect(hook.current.isAuthenticated).toBe(true);
    });
  });

  it("should not authenticate the user if the GraphQL query fails", async () => {
    const mockFetchPromise = jest.fn().mockResolvedValue({ ok: false });
    jest.spyOn(global, "fetch").mockImplementation(mockFetchPromise);

    const { Component, hook } = renderComponentWithHook();
    render(<Component />, { wrapper });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(graphqlURL, authenticationFetchParams);
    await waitFor(() => {
      expect(hook.current.isAuthenticated).toBe(false);
    });
  });

  describe("login", () => {
    it("should authenticate when the response is successful", async () => {
      const mockFetchPromise = jest.fn().mockResolvedValue({ ok: true });
      jest.spyOn(global, "fetch").mockImplementation(mockFetchPromise);

      const { Component, hook } = renderComponentWithHook();
      render(<Component />, { wrapper });

      act(() => {
        hook.current.login({ username: "username", password: "password" });
      });
      await waitFor(() => {
        expect(hook.current.isAuthenticated).toBe(true);
      });
    });

    it("should not authenticate when the response is unsuccessful", async () => {
      const mockFetchPromise = jest.fn().mockResolvedValue({ ok: false });
      jest.spyOn(global, "fetch").mockImplementation(mockFetchPromise);

      const { Component, hook } = renderComponentWithHook();
      render(<Component />, { wrapper });

      act(() => {
        hook.current.login({ username: "username", password: "password" });
      });
      await waitFor(() => {
        expect(hook.current.isAuthenticated).toBe(false);
      });
    });
  });

  describe("logoutAndRedirect", () => {
    it("should redirect to the /login page locally", async () => {
      mockEnv("NODE_ENV", "development");
      const mockFetchPromise = jest.fn().mockResolvedValue({});
      jest.spyOn(global, "fetch").mockImplementation(mockFetchPromise);

      const { Component, hook } = renderComponentWithHook();
      const { history } = render(<Component />, { wrapper });

      act(() => {
        hook.current.logoutAndRedirect();
      });
      await waitFor(() => {
        expect(hook.current.isAuthenticated).toBe(false);
      });
      expect(history.location.pathname).toBe("/login");
    });

    it("should redirect to the Evergreen /login page otherwise", async () => {
      mockEnv("NODE_ENV", "production");
      const mockFetchPromise = jest.fn().mockResolvedValue({});
      jest.spyOn(global, "fetch").mockImplementation(mockFetchPromise);

      const { Component, hook } = renderComponentWithHook();
      render(<Component />, { wrapper });

      act(() => {
        hook.current.logoutAndRedirect();
      });
      await waitFor(() => {
        expect(hook.current.isAuthenticated).toBe(false);
      });
      expect(window.location.href).toBe(`${evergreenURL}/login`);
    });
  });
});
