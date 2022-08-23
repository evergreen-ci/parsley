import { Global, css } from "@emotion/react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import NavBar from "components/NavBar";
import Content from "pages/Content";

const globalStyles = css`
  background-color: white;
  body {
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
