import { Global, css } from "@emotion/react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import NavBar from "components/NavBar";
import { GlobalProviders } from "context";
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
    <GlobalProviders>
      <Router>
        <NavBar />
        <Routes>
          <Route element={<Content />} path="/*" />
        </Routes>
      </Router>
    </GlobalProviders>
  </>
);

export default App;
