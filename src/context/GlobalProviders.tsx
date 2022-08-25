import React from "react";
import LeafyGreenProvider from "@leafygreen-ui/leafygreen-provider";
import { LogContextProvider } from "./LogContext";

/**
 * GlobalProviders wrap our application with our global contexts
 */
const GlobalProviders: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => (
  <LeafyGreenProvider>
    <LogContextProvider>{children}</LogContextProvider>
  </LeafyGreenProvider>
);

export default GlobalProviders;
