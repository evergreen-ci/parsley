import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import NavBar from "components/NavBar";
import { GlobalStyles } from "components/styles";
import { GlobalProviders } from "context";
import Content from "pages/Content";

const App = () => (
  <>
    <GlobalStyles />
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
