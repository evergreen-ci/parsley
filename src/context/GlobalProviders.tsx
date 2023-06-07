import LeafyGreenProvider from "@leafygreen-ui/leafygreen-provider";
import GQLProvider from "gql/GQLProvider";
import { AuthProvider } from "./auth";
import { LogContextProvider } from "./LogContext";
import { ToastProvider } from "./toast";

/**
 * GlobalProviders wrap our application with our global contexts
 * children - React children
 * @param props - React props
 * @param props.children - Children to be wrapped
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
