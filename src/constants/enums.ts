enum LogTypes {
  EVERGREEN_TASK_LOGS = "EVERGREEN_TASK_LOGS",
  EVERGREEN_TEST_LOGS = "EVERGREEN_TEST_LOGS",
  RESMOKE_LOGS = "RESMOKE_LOGS",
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
  Search = "search",
}

export { LogTypes, CaseSensitivity, MatchType, SearchBarActions };
