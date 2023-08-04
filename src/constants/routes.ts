const paths = {
  evergreenLogs: "/evergreen",
  home: "/",
  login: "/login",
  resmokeLogs: "/resmoke",
  testLogs: "/test",
  upload: "/upload",
};

enum slugs {
  taskID = "taskId",
  execution = "execution",
  origin = "origin",
  testID = "testId",
  buildID = "buildId",
  groupID = "groupId",
}

const routes = {
  evergreenLogs: `${paths.evergreenLogs}/:${slugs.taskID}/:${slugs.execution}/:${slugs.origin}`,
  login: paths.login,
  resmokeLogs: `${paths.resmokeLogs}/:${slugs.buildID}/test/:${slugs.testID}`,
  resmokeLogsAll: `${paths.resmokeLogs}/:${slugs.buildID}/all`,
  root: paths.home,
  testLogs: `${paths.testLogs}/:${slugs.taskID}/:${slugs.execution}/:${slugs.testID}`,
  upload: paths.upload,
};

export { slugs };
export default routes;
