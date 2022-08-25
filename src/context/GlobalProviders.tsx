import React from "react";
import { Global, css } from "@emotion/react";
import LeafyGreenProvider from "@leafygreen-ui/leafygreen-provider";
import { LogContextProvider } from "./LogContext";

const globalStyles = css`
  background-color: white;
  body {
    margin: 0;
  }
`;
/**
 * GlobalProviders wrap our application with our global contexts as well as apply our global styles.
 */
const GlobalProviders: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => (
  <LeafyGreenProvider>
    <Global styles={globalStyles} />
    <LogContextProvider>{children}</LogContextProvider>
  </LeafyGreenProvider>
);

export default GlobalProviders;
