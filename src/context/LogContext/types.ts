import { FilterLogic, LogTypes, WordWrapFormat } from "constants/enums";

interface SearchState {
  searchTerm?: RegExp;
  searchIndex?: number;
  searchRange?: number;
  hasSearch: boolean;
  caseSensitive: boolean;
}

interface LogMetadata {
  buildID?: string;
  execution?: string;
  fileName?: string;
  htmlLogURL?: string;
  isUploadedLog?: boolean;
  jobLogsURL?: string;
  legacyJobLogsURL?: string;
  logType?: LogTypes;
  origin?: string;
  rawLogURL?: string;
  renderingType?: string;
  taskID?: string;
  testID?: string;
}

interface Preferences {
  caseSensitive: boolean;
  expandableRows: boolean;
  filterLogic: FilterLogic;
  prettyPrint: boolean;
  wordWrapFormat: WordWrapFormat;
  wrap: boolean;
  zebraStriping: boolean;
  setCaseSensitive: (caseSensitive: boolean) => void;
  setExpandableRows: (expandableRows: boolean) => void;
  setFilterLogic: (filterLogic: FilterLogic) => void;
  setWrap: (wrap: boolean) => void;
  setWordWrapFormat: (wrapFormat: WordWrapFormat) => void;
  setPrettyPrint: (prettyPrint: boolean) => void;
  setZebraStriping: (zebraStriping: boolean) => void;
}

enum DIRECTION {
  PREVIOUS,
  NEXT,
}

export { DIRECTION };
export type { LogMetadata, Preferences, SearchState };
