import { Global, css } from "@emotion/react";
import fontStyles from "components/styles/fonts";

const resetStyles = css`
  /* Reset styles */
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
`;

const globalStyles = css`
  ${fontStyles}
  ${resetStyles}
  background-color: white;
  body {
    font-family: "Euclid Circular A", "Helvetica Neue", Helvetica, Arial,
      sans-serif;
    margin: 0;
    /* Prevent scroll bounce behavior */
    overscroll-behavior-y: none;
    overscroll-behavior-x: none;
    /* Hides scroll bar on webkit browsers preventing it from using up page width */
    ::-webkit-scrollbar {
      display: none;
    }
  }
`;

const GlobalStyles = () => <Global styles={globalStyles} />;

export default GlobalStyles;
