const paths = {
  home: "/",
  upload: "/upload",
  evergreenLogs: "/evergreen",
  testLogs: "/test",
  resmokeLogs: "/resmoke",
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
  root: paths.home,
  upload: paths.upload,
  evergreenLogs: `${paths.evergreenLogs}/:${slugs.taskID}/:${slugs.execution}/:${slugs.origin}`,
  testLogs: `${paths.testLogs}/:${slugs.taskID}/:${slugs.execution}/:${slugs.testID}`,
  resmokeLogs: `${paths.resmokeLogs}/:${slugs.buildID}/test/:${slugs.testID}`,
  resmokeLogsAll: `${paths.resmokeLogs}/:${slugs.buildID}/all`,
};

export { slugs };
export default routes;
