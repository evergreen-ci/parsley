import { useReducer } from "react";
import { LogTypes } from "constants/enums";
import { ExpandedLines } from "types/logs";
import { mergeIntervals } from "utils/expandedRanges";
import { processResmokeLine } from "utils/resmoke";

interface LogState {
  logs: string[];
  fileName?: string;
  logType?: LogTypes;
  expandedLines: ExpandedLines;
}

type Action =
  | { type: "INGEST_LOGS"; logs: string[]; logType: LogTypes }
  | { type: "CLEAR_LOGS" }
  | { type: "EXPAND_LINES"; expandedLines: ExpandedLines }
  | { type: "COLLAPSE_LINES"; idx: number }
  | { type: "SET_FILE_NAME"; fileName: string };

const initialState = (initialLogLines?: string[]): LogState => ({
  logs: initialLogLines || [],
  expandedLines: [],
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
        expandedLines: [],
        fileName: "",
        logType: undefined,
      };
    case "EXPAND_LINES": {
      const intervals = state.expandedLines.concat(action.expandedLines);
      return {
        ...state,
        expandedLines: mergeIntervals(intervals),
      };
    }
    case "COLLAPSE_LINES": {
      const newExpandedLines = state.expandedLines.filter(
        (_f, idx) => idx !== action.idx
      );
      return {
        ...state,
        expandedLines: newExpandedLines,
      };
    }
    case "SET_FILE_NAME":
      return {
        ...state,
        fileName: action.fileName,
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
