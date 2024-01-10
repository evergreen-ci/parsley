import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  evergreenURL,
  graphqlURL,
  isDevelopmentBuild,
} from "utils/environmentVariables";
import {
  SentryBreadcrumb,
  leaveBreadcrumb,
  reportError,
} from "utils/errorReporting";

type LoginCreds = { username: string; password: string };

interface AuthContextState {
  isAuthenticated: boolean;
  devLogin: (creds: LoginCreds) => void;
  logoutAndRedirect: () => void;
}

const AuthContext = createContext<AuthContextState | null>(null);

const useAuthContext = (): AuthContextState => {
  const context = useContext(AuthContext);
  if (context === null || context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // This hook is used to check if a user is authenticated or not. It executes an arbitrary query against the
  // GraphQL endpoint. If the request is successful, that means the user is authenticated.
  useEffect(() => {
    const checkLogin = async () => {
      await fetch(`${graphqlURL}`, {
        body: JSON.stringify({ query: `query { user { userId } }` }),
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        method: "POST",
      })
        .then((response) => {
          if (response.ok) {
            leaveBreadcrumb("Authenticated", {}, SentryBreadcrumb.User);
            setIsAuthenticated(true);
          } else {
            leaveBreadcrumb(
              "Not Authenticated",
              { status_code: response.status },
              SentryBreadcrumb.User,
            );
            logoutAndRedirect();
          }
        })
        .catch((err: Error) => {
          leaveBreadcrumb("checkLogin", { err }, SentryBreadcrumb.Error);
          reportError(err).severe();
        });
    };

    checkLogin();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // This function is only used in local development.
  const devLogin = useCallback(async ({ password, username }: LoginCreds) => {
    await fetch(`${evergreenURL}/login`, {
      body: JSON.stringify({ password, username }),
      credentials: "include",
      method: "POST",
    }).then((response) => {
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });
  }, []);

  const logoutAndRedirect = useCallback(async () => {
    await fetch(`${evergreenURL}/logout`, {
      credentials: "include",
      method: "GET",
      redirect: "manual",
    }).then(() => {
      setIsAuthenticated(false);
      if (isDevelopmentBuild()) {
        navigate("/login");
      } else {
        window.location.href = `${evergreenURL}/login`;
      }
    });
  }, [navigate]);

  const memoizedContext = useMemo(
    () => ({
      devLogin,
      isAuthenticated,
      logoutAndRedirect,
    }),
    [isAuthenticated, devLogin, logoutAndRedirect],
  );

  return (
    <AuthContext.Provider value={memoizedContext}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, useAuthContext };
