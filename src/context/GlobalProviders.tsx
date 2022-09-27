import LeafyGreenProvider from "@leafygreen-ui/leafygreen-provider";
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
      <LogContextProvider>{children}</LogContextProvider>
    </ToastProvider>
  </LeafyGreenProvider>
);

export default GlobalProviders;
