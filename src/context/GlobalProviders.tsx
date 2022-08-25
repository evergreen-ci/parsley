import React from "react";
import { Global, css } from "@emotion/react";
import LeafyGreenProvider from "@leafygreen-ui/leafygreen-provider";

const globalStyles = css`
  background-color: white;
  body {
    margin: 0;
  }
`;

const GlobalProviders: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => (
  <LeafyGreenProvider>
    <Global styles={globalStyles} />
    {children}
  </LeafyGreenProvider>
);

export default GlobalProviders;
