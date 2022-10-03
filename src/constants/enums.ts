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

export { LogTypes, CaseSensitivity, MatchType };
