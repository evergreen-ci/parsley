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
  isDevelopment,
} from "utils/environmentVariables";
import { leaveBreadcrumb } from "utils/errorReporting";

type LoginCreds = { username: string; password: string };

interface AuthState {
  isAuthenticated: boolean;
  login: (creds: LoginCreds) => void;
  logoutAndRedirect: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

const useAuthContext = (): AuthState => {
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
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: `query { user { userId } }` }),
      }).then((response) => {
        if (response.ok) {
          leaveBreadcrumb("Authenticated", {}, "user");
          setIsAuthenticated(true);
        } else {
          leaveBreadcrumb(
            "Not Authenticated",
            { statusCode: response.status },
            "user"
          );
          logoutAndRedirect();
        }
      });
    };

    checkLogin();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // This function is only used in local development.
  const login = useCallback(async ({ username, password }: LoginCreds) => {
    await fetch(`${evergreenURL}/login`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ username, password }),
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
      method: "GET",
      credentials: "include",
      redirect: "manual",
    }).then(() => {
      setIsAuthenticated(false);
      if (isDevelopment()) {
        navigate("/login");
      } else {
        window.location.href = `${evergreenURL}/login`;
      }
    });
  }, [navigate]);

  const memoizedContext = useMemo(
    () => ({
      isAuthenticated,
      login,
      logoutAndRedirect,
    }),
    [isAuthenticated, login, logoutAndRedirect]
  );

  return (
    <AuthContext.Provider value={memoizedContext}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, useAuthContext };
