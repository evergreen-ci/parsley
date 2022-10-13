import { LogTypes } from "constants/enums";

interface SearchState {
  searchTerm?: RegExp;
  searchIndex?: number;
  searchRange?: number;
  hasSearch: boolean;
  caseSensitive: boolean;
}

interface LogMetadata {
  logType?: LogTypes;
  fileName?: string;
  taskId?: string;
  execution?: number;
  testId?: string;
  buildId?: string;
  origin?: string;
}

enum DIRECTION {
  PREVIOUS,
  NEXT,
}

export { DIRECTION };
export type { SearchState, LogMetadata };
