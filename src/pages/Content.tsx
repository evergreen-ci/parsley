import { Route, Routes } from "react-router-dom";
import { LogTypes } from "constants/enums";
import routes from "constants/routes";
import LoadingPage from "./LoadingPage";
import LogView from "./LogView";

const Content: React.FC = () => (
  <Routes>
    <Route element={<LoadingPage />} path={routes.root} />
    <Route
      element={<LogView logType={LogTypes.EVERGREEN_TASK_LOGS} />}
      path={routes.evergreenLogs}
    />
    <Route
      element={<LogView logType={LogTypes.EVERGREEN_TEST_LOGS} />}
      path={routes.testLogs}
    />
    <Route
      element={<LogView logType={LogTypes.RESMOKE_LOGS} />}
      path={routes.resmokeLogs}
    />
  </Routes>
);

export default Content;
