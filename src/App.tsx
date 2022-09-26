import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import NavBar from "components/NavBar";
import { GlobalStyles } from "components/styles";
import { GlobalProviders } from "context";
import Content from "pages";

const App = () => (
  <>
    <GlobalStyles />
    <Router>
      <GlobalProviders>
        <>
          <NavBar />
          <Routes>
            <Route element={<Content />} path="/*" />
          </Routes>
        </>
      </GlobalProviders>
    </Router>
  </>
);

export default App;
