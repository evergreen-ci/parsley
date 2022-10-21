import styled from "@emotion/styled";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ErrorBoundary } from "components/ErrorBoundary";
import NavBar from "components/NavBar";
import { GlobalStyles } from "components/styles";
import { GlobalProviders } from "context";
import Content from "pages";

const App = () => (
  <ErrorBoundary>
    <GlobalStyles />
    <Router>
      <GlobalProviders>
        <AppWrapper>
          <NavBar />
          <Routes>
            <Route element={<Content />} path="/*" />
          </Routes>
        </AppWrapper>
      </GlobalProviders>
    </Router>
  </ErrorBoundary>
);

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

export default App;
