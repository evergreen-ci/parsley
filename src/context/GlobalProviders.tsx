import LeafyGreenProvider from "@leafygreen-ui/leafygreen-provider";
import GQLProvider from "gql/GQLProvider";
import { LogContextProvider } from "./LogContext";
import { ToastProvider } from "./toast";

/**
 * GlobalProviders wrap our application with our global contexts
 */
const GlobalProviders: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => (
  <LeafyGreenProvider>
    <ToastProvider>
      <GQLProvider>
        <LogContextProvider>{children}</LogContextProvider>
      </GQLProvider>
    </ToastProvider>
  </LeafyGreenProvider>
);

export default GlobalProviders;
