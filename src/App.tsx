import styled from "@emotion/styled";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ErrorBoundary } from "components/ErrorHandling";
import { GlobalStyles } from "components/styles";
import routes from "constants/routes";
import { GlobalProviders } from "context";
import Content from "pages";
import { Login } from "pages/Login";

const App = () => (
  <ErrorBoundary>
    <GlobalStyles />
    <Router>
      <GlobalProviders>
        <AppWrapper>
          <Routes>
            <Route element={<Login />} path={routes.login} />
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
