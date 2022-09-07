const paths = {
  home: "/",
  evergreenLogs: "/evergreen",
  testLogs: "/test",
  resmokeLogs: "/resmoke",
};

enum slugs {
  taskID = "task_id",
  execution = "execution",
  origin = "origin",
  testID = "test_id",
  buildID = "build_id",
}

const routes = {
  root: paths.home,
  evergreenLogs: `${paths.evergreenLogs}/:${slugs.taskID}/:${slugs.execution}/:${slugs.origin}`,
  testLogs: `${paths.testLogs}/:${slugs.taskID}/:${slugs.execution}/:${slugs.testID}`,
  resmokeLogs: `${paths.resmokeLogs}/:${slugs.buildID}/:${slugs.testID}`,
};

export { slugs };
export default routes;
