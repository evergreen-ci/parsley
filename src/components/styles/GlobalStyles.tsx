import { Global, css } from "@emotion/react";
import fontStyles from "components/styles/fonts";

const globalStyles = css`
  ${fontStyles}
  background-color: white;
  body {
    font-family: "Euclid Circular A", "Helvetica Neue", Helvetica, Arial,
      sans-serif;
    margin: 0;
    /* Prevent scroll bounce behavior */
    overscroll-behavior-y: none;
    overscroll-behavior-x: none;
  }
`;
const GlobalStyles = () => <Global styles={globalStyles} />;

export default GlobalStyles;
