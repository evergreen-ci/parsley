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
  taskID?: string;
  execution?: string;
  testID?: string;
  buildID?: string;
  origin?: string;
}

enum DIRECTION {
  PREVIOUS,
  NEXT,
}

export { DIRECTION };
export type { SearchState, LogMetadata };
