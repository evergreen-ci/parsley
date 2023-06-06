import { FilterLogic, LogTypes } from "constants/enums";

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
  htmlLogURL?: string;
  rawLogURL?: string;
  jobLogsURL?: string;
  legacyJobLogsURL?: string;
  lobsterURL?: string;
}

interface Preferences {
  caseSensitive: boolean;
  expandableRows: boolean;
  filterLogic: FilterLogic;
  prettyPrint: boolean;
  wrap: boolean;
  setCaseSensitive: (caseSensitive: boolean) => void;
  setExpandableRows: (expandableRows: boolean) => void;
  setFilterLogic: (filterLogic: FilterLogic) => void;
  setWrap: (wrap: boolean) => void;
  setPrettyPrint: (prettyPrint: boolean) => void;
}

enum DIRECTION {
  PREVIOUS,
  NEXT,
}

export { DIRECTION };
export type { LogMetadata, Preferences, SearchState };
