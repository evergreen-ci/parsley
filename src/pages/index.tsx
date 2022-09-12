import { Navigate, Route, Routes } from "react-router-dom";
import { LogTypes } from "constants/enums";
import routes from "constants/routes";
import LogDrop from "./LogDrop";
import LogView from "./LogView";

const Content: React.FC = () => (
  <Routes>
    <Route element={<Navigate to={routes.upload} />} path={routes.root} />
    <Route element={<LogDrop />} path={routes.upload} />
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
