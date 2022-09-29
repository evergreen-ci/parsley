import { useReducer } from "react";
import { LogTypes } from "constants/enums";
import { processResmokeLine } from "utils/resmoke";

interface searchState {
  searchTerm?: RegExp;
  searchIndex?: number;
  searchRange?: number;
}
interface LogState {
  logs: string[];
  fileName?: string;
  logType?: LogTypes;
  lineNumber?: number;
  searchState: searchState;
}

type Action =
  | { type: "INGEST_LOGS"; logs: string[]; logType: LogTypes }
  | { type: "CLEAR_LOGS" }
  | { type: "SET_FILE_NAME"; fileName: string }
  | { type: "SET_SEARCH_TERM"; searchTerm: string; caseSensitive: boolean }
  | { type: "SCROLL_TO_LINE"; lineNumber: number };

const initialState = (initialLogLines?: string[]): LogState => ({
  logs: initialLogLines || [],
  searchState: {},
});

const reducer = (state: LogState, action: Action): LogState => {
  switch (action.type) {
    case "INGEST_LOGS": {
      let processedLogs = action.logs;
      switch (action.logType) {
        case LogTypes.RESMOKE_LOGS:
          processedLogs = action.logs.map(processResmokeLine);
          break;
        default:
          break;
      }
      return {
        ...state,
        logs: processedLogs,
        logType: action.logType,
      };
    }
    case "CLEAR_LOGS":
      return {
        ...state,
        logs: [],
        fileName: "",
        logType: undefined,
      };
    case "SET_FILE_NAME":
      return {
        ...state,
        fileName: action.fileName,
      };
    case "SET_SEARCH_TERM": {
      const searchTerm = new RegExp(
        action.searchTerm,
        action.caseSensitive ? "g" : "gi"
      );
      return {
        ...state,
        searchState: {
          searchTerm: action.searchTerm.length ? searchTerm : undefined,
          searchIndex: 0,
          searchRange: 0,
        },
      };
    }
    case "SCROLL_TO_LINE":
      return {
        ...state,
        lineNumber: action.lineNumber,
      };
    default:
      throw new Error(`Unknown reducer action ${action}`);
  }
};

const useLogState = (initialLogLines?: string[]) => {
  const [state, dispatch] = useReducer(reducer, initialState(initialLogLines));
  return {
    state,
    dispatch,
  };
};

export default useLogState;
