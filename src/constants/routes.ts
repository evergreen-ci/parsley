const paths = {
  home: "/",
  upload: "/upload",
  evergreenLogs: "/evergreen",
  testLogs: "/test",
  resmokeLogs: "/resmoke",
};

const slugs = {
  taskID: ":task_id",
  execution: ":execution",
  origin: ":origin",
  testID: ":test_id",
  buildID: ":build_id",
};

const routes = {
  root: paths.home,
  upload: paths.upload,
  evergreenLogs: `${paths.evergreenLogs}/${slugs.taskID}/${slugs.execution}/${slugs.origin}`,
  testLogs: `${paths.testLogs}/${slugs.taskID}/${slugs.execution}/${slugs.testID}`,
  resmokeLogs: `${paths.resmokeLogs}/${slugs.buildID}/${slugs.testID}`,
};

export default routes;
