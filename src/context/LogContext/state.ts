import { useReducer } from "react";
import { LogTypes } from "constants/enums";
import { getColorMapping, processResmokeLine } from "utils/resmoke";
import { LogMetadata, SearchState } from "./types";

interface LogState {
  logs: string[];
  colorMapping?: Record<string, string>;
  logMetadata?: LogMetadata;
  lineNumber?: number;
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
  | { type: "PAGINATE"; nextPage: number };

const initialState = (initialLogLines?: string[]): LogState => ({
  logs: initialLogLines || [],
  searchState: {
    searchIndex: 0,
    searchRange: 0,
    hasSearch: false,
    caseSensitive: false,
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
        logs: processedLogs,
        colorMapping: colorMap,
        logMetadata: {
          ...state.logMetadata,
          logType: action.logType,
        },
      };
    }
    case "CLEAR_LOGS":
      return initialState([]);
    case "SET_LOG_METADATA":
      return {
        ...state,
        logMetadata: action.logMetadata,
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
          searchTerm: hasSearch ? searchTerm : undefined,
          searchIndex: undefined,
          searchRange: undefined,
          hasSearch,
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
          searchTerm: newSearchTerm,
          searchIndex: undefined,
          searchRange: undefined,
          hasSearch: true,
          caseSensitive: action.caseSensitive,
        },
      };
    }
    case "SET_MATCH_COUNT":
      return {
        ...state,
        searchState: {
          ...state.searchState,
          searchRange: action.matchCount ? action.matchCount : undefined,
          searchIndex: action.matchCount ? 0 : undefined,
        },
      };
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
    state,
    dispatch,
  };
};

export default useLogState;
