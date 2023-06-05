import LeafyGreenProvider from "@leafygreen-ui/leafygreen-provider";
import GQLProvider from "gql/GQLProvider";
import { AuthProvider } from "./auth";
import { LogContextProvider } from "./LogContext";
import { ToastProvider } from "./toast";

/**
 * GlobalProviders wrap our application with our global contexts
 * @param children - the application
 * @param children.children - the application
 * @returns the application wrapped with our global contexts
 */
const GlobalProviders: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => (
  <AuthProvider>
    <LeafyGreenProvider>
      <ToastProvider>
        <GQLProvider>
          <LogContextProvider>{children}</LogContextProvider>
        </GQLProvider>
      </ToastProvider>
    </LeafyGreenProvider>
  </AuthProvider>
);

export default GlobalProviders;
