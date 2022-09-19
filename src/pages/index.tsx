import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { LogTypes } from "constants/enums";
import routes from "constants/routes";
import LogView from "./LogView";

const LogDrop = lazy(() => import("./LogDrop"));
const Content: React.FC = () => (
  <Routes>
    <Route element={<Navigate to={routes.upload} />} path={routes.root} />
    <Route
      element={
        <Suspense fallback={<div>Loading...</div>}>
          <LogDrop />
        </Suspense>
      }
      path={routes.upload}
    />
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
