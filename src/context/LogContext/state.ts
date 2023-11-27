import { useReducer } from "react";
import Cookie from "js-cookie";
import { CASE_SENSITIVE } from "constants/cookies";
import { LogTypes } from "constants/enums";
import { ExpandedLines } from "types/logs";
import { mergeIntervals } from "utils/expandedLines";
import { getColorMapping, processResmokeLine } from "utils/resmoke";
import { LogMetadata, SearchState } from "./types";

interface LogState {
  colorMapping?: Record<string, string>;
  expandedLines: ExpandedLines;
  hasLogs: boolean | null;
  lineNumber?: number;
  logMetadata?: LogMetadata;
  logs: string[];
  searchState: SearchState;
}

type Action =
  | { type: "INGEST_LOGS"; logs: string[]; logType: LogTypes }
  | { type: "CLEAR_LOGS" }
  | { type: "SET_FILE_NAME"; fileName: string }
  | { type: "SET_LOG_METADATA"; logMetadata: LogMetadata }
  | { type: "SET_SEARCH_TERM"; searchTerm: string }
  | { type: "SET_CASE_SENSITIVE"; caseSensitive: boolean }
  | { type: "SET_MATCH_COUNT"; matchCount: number }
  | { type: "EXPAND_LINES"; expandedLines: ExpandedLines }
  | { type: "COLLAPSE_LINES"; idx: number }
  | { type: "CLEAR_EXPANDED_LINES" }
  | { type: "PAGINATE"; nextPage: number };

const initialState = (initialLogLines?: string[]): LogState => ({
  expandedLines: [],
  hasLogs: null,
  logs: initialLogLines || [],
  searchState: {
    caseSensitive: Cookie.get(CASE_SENSITIVE) === "true",
    hasSearch: false,
    searchIndex: 0,
    searchRange: 0,
  },
});

const reducer = (state: LogState, action: Action): LogState => {
  switch (action.type) {
    case "INGEST_LOGS": {
      let processedLogs;
      let colorMap;
      switch (action.logType) {
        case LogTypes.RESMOKE_LOGS: {
          const transformedLogs = action.logs.reduce(
            (acc, logLine) => {
              const processedLogLine = processResmokeLine(logLine);
              const colorMapping = getColorMapping(
                processedLogLine,
                acc.colorMap
              );
              if (colorMapping) {
                acc.colorMap[colorMapping.portOrState] = colorMapping.color;
              }
              acc.processedLogs.push(processedLogLine);
              return acc;
            },
            {
              colorMap: {} as Record<string, string>,
              processedLogs: [] as string[],
            }
          );
          processedLogs = transformedLogs.processedLogs;
          colorMap = transformedLogs.colorMap;
          break;
        }
        default:
          processedLogs = action.logs;
          break;
      }
      return {
        ...state,
        colorMapping: colorMap,
        hasLogs: processedLogs.length !== 0,
        logMetadata: {
          ...state.logMetadata,
          logType: action.logType,
        },
        logs: processedLogs,
      };
    }
    case "CLEAR_LOGS":
      return initialState([]);
    case "SET_LOG_METADATA":
      return {
        ...state,
        logMetadata: action.logMetadata,
      };
    case "EXPAND_LINES": {
      const intervals = state.expandedLines.concat(action.expandedLines);
      console.log(state.expandedLines, action.expandedLines);
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
    case "CLEAR_EXPANDED_LINES":
      return {
        ...state,
        expandedLines: [],
      };
    case "SET_FILE_NAME":
      return {
        ...state,
        logMetadata: {
          ...state.logMetadata,
          fileName: action.fileName,
        },
      };
    case "SET_SEARCH_TERM": {
      const hasSearch = !!action.searchTerm;
      const searchTerm = new RegExp(
        action.searchTerm,
        state.searchState.caseSensitive ? "" : "i"
      );
      return {
        ...state,
        searchState: {
          ...state.searchState,
          hasSearch,
          searchIndex: undefined,
          searchRange: undefined,
          searchTerm: hasSearch ? searchTerm : undefined,
        },
      };
    }
    case "SET_CASE_SENSITIVE": {
      const { searchTerm } = state.searchState;
      if (!searchTerm) {
        return {
          ...state,
          searchState: {
            ...state.searchState,
            caseSensitive: action.caseSensitive,
          },
        };
      }
      const newSearchTerm = new RegExp(
        searchTerm.source,
        action.caseSensitive ? "" : "i"
      );
      return {
        ...state,
        searchState: {
          caseSensitive: action.caseSensitive,
          hasSearch: true,
          searchIndex: undefined,
          searchRange: undefined,
          searchTerm: newSearchTerm,
        },
      };
    }
    case "SET_MATCH_COUNT": {
      // If the search range has changed, reset the search index to 0
      let { searchIndex } = state.searchState;
      const { searchRange } = state.searchState;
      if (searchRange !== action.matchCount) {
        searchIndex = action.matchCount ? 0 : undefined;
      }
      return {
        ...state,
        searchState: {
          ...state.searchState,
          searchIndex,
          searchRange: action.matchCount ? action.matchCount : undefined,
        },
      };
    }
    case "PAGINATE":
      return {
        ...state,
        searchState: {
          ...state.searchState,
          searchIndex: action.nextPage,
        },
      };
    default:
      throw new Error(`Unknown reducer action ${action}`);
  }
};

const useLogState = (initialLogLines?: string[]) => {
  const [state, dispatch] = useReducer(reducer, initialState(initialLogLines));
  return {
    dispatch,
    state,
  };
};

export default useLogState;
