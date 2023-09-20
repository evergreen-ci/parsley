const paths = {
  evergreenLogs: "/evergreen",
  home: "/",
  login: "/login",
  resmokeLogs: "/resmoke",
  taskFile: "/taskFile",
  testLogs: "/test",
  upload: "/upload",
};

enum slugs {
  taskID = "taskId",
  execution = "execution",
  origin = "origin",
  testID = "testId",
  fileName = "fileName",
  buildID = "buildId",
  groupID = "groupId",
}

const routes = {
  evergreenLogs: `${paths.evergreenLogs}/:${slugs.taskID}/:${slugs.execution}/:${slugs.origin}`,
  login: paths.login,
  resmokeLogs: `${paths.resmokeLogs}/:${slugs.buildID}/test/:${slugs.testID}`,
  resmokeLogsAll: `${paths.resmokeLogs}/:${slugs.buildID}/all`,
  root: paths.home,
  taskFiles: `${paths.taskFile}/:${slugs.taskID}/:${slugs.execution}/:${slugs.fileName}`,
  testLogs: `${paths.testLogs}/:${slugs.taskID}/:${slugs.execution}/:${slugs.testID}`,
  upload: paths.upload,
};

export { slugs };
export default routes;
