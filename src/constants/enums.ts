enum LogTypes {
  EVERGREEN_TASK_FILE = "EVERGREEN_TASK_FILE",
  EVERGREEN_TASK_LOGS = "EVERGREEN_TASK_LOGS",
  EVERGREEN_TEST_LOGS = "EVERGREEN_TEST_LOGS",
  RESMOKE_LOGS = "RESMOKE_LOGS",
}

enum SupportedLogRenderingTypes {
  Default = "default",
  Resmoke = "resmoke",
}

enum CaseSensitivity {
  Sensitive = "sensitive",
  Insensitive = "insensitive",
}

enum MatchType {
  Exact = "exact",
  Inverse = "inverse",
}

enum SearchBarActions {
  Filter = "filter",
  Highlight = "highlight",
}

enum FilterLogic {
  And = "and",
  Or = "or",
}

enum WordWrapFormat {
  Aggressive = "aggressive",
  Standard = "standard",
}

export {
  CaseSensitivity,
  FilterLogic,
  SupportedLogRenderingTypes,
  LogTypes,
  MatchType,
  SearchBarActions,
  WordWrapFormat,
};
