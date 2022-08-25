import { Global, css } from "@emotion/react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import NavBar from "components/NavBar";
import fontStyles from "components/styles/fonts";
import Content from "pages/Content";

const globalStyles = css`
  ${fontStyles}
  background-color: white;
  body {
    font-family: "Euclid Circular A", "Helvetica Neue", Helvetica, Arial,
      sans-serif;
    margin: 0;
  }
`;

const App = () => (
  <>
    <Global styles={globalStyles} />
    <Router>
      <NavBar />
      <Routes>
        <Route element={<Content />} path="/*" />
      </Routes>
    </Router>
  </>
);

export default App;
