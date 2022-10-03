import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { List } from "react-virtualized";
import { LogTypes } from "constants/enums";
import { FilterLogic, QueryParams } from "constants/queryParams";
import { useQueryParam } from "hooks/useQueryParam";
import { ProcessedLogLines } from "types/logs";
import { filterLogs } from "utils/filter";
import searchLogs from "utils/searchLogs";
import useLogState from "./state";
import { DIRECTION, SearchState } from "./types";

interface LogContextState {
  fileName?: string;
  hasLogs: boolean;
  lineCount: number;
  processedLogLines: ProcessedLogLines;
  selectedLine?: number;
  searchState: SearchState;
  listRef: React.RefObject<List>;
  highlightedLine?: number;
  clearLogs: () => void;
  getLine: (lineNumber: number) => string | undefined;
  ingestLines: (logs: string[], logType: LogTypes) => void;
  scrollToLine: (lineNumber: number) => void;
  setFileName: (fileName: string) => void;
  setSearch: (search: string) => void;
  paginate: (dir: DIRECTION) => void;
}
const LogContext = createContext<LogContextState | null>(null);

const useLogContext = () => {
  const context = useContext(LogContext);
  if (context === undefined) {
    throw new Error("useLogContext must be used within a LogContextProvider");
  }
  return context as LogContextState;
};

interface LogContextProviderProps {
  children: React.ReactNode;
  initialLogLines?: string[];
}

const LogContextProvider: React.FC<LogContextProviderProps> = ({
  children,
  initialLogLines,
}) => {
  const [filters] = useQueryParam<string[]>(QueryParams.Filters, []);
  const [bookmarks] = useQueryParam<number[]>(QueryParams.Bookmarks, []);
  const [selectedLine] = useQueryParam<number | undefined>(
    QueryParams.SelectedLine,
    undefined
  );
  const [filterLogic] = useQueryParam(QueryParams.FilterLogic, FilterLogic.And);
  const [caseSensitive] = useQueryParam(QueryParams.CaseSensitive, false);
  const [upperRange] = useQueryParam<undefined | number>(
    QueryParams.UpperRange,
    undefined
  );
  const [lowerRange] = useQueryParam(QueryParams.LowerRange, 0);
  const { state, dispatch } = useLogState(initialLogLines);
  const listRef = useRef<List>(null);

  const getLine = useCallback(
    (lineNumber: number) => state.logs[lineNumber],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.logs.length]
  );

  const scrollToLine = useCallback((lineNumber: number) => {
    listRef.current?.scrollToRow(lineNumber);
  }, []);

  // TODO EVG-17537: more advanced filtering
  const processedLogLines = useMemo(
    () => filterLogs(state.logs, filters, bookmarks, selectedLine, filterLogic),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.logs.length, `${filters}`, `${bookmarks}`, selectedLine, filterLogic]
  );

  const searchResults = useMemo(
    () =>
      // search through processedLoglines
      // return the line number of the first match
      // if no match, return undefined
      state.searchState.searchTerm
        ? searchLogs({
            searchRegex: state.searchState.searchTerm,
            processedLogLines,
            upperBound: upperRange,
            lowerBound: lowerRange,
            getLine,
          })
        : [],
    [
      state.searchState.searchTerm,
      upperRange,
      lowerRange,
      processedLogLines,
      getLine,
    ]
  );

  // Handle case sensitivity changes
  useEffect(() => {
    dispatch({ type: "TOGGLE_CASE_SENSITIVE", caseSensitive });
  }, [caseSensitive, dispatch]);

  // Handle search result changes
  useEffect(() => {
    dispatch({
      type: "SET_MATCH_COUNT",
      matchCount: searchResults.length,
    });
  }, [dispatch, searchResults.length, state.searchState.searchTerm]);

  // If the selected line changes, scroll to it
  useEffect(() => {
    if (selectedLine) {
      scrollToLine(selectedLine);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.logs.length > 0, selectedLine]);

  // If the search term changes, scroll to the first match
  useEffect(() => {
    if (state.searchState.searchIndex !== undefined) {
      scrollToLine(searchResults[state.searchState.searchIndex]);
    }
  }, [scrollToLine, searchResults, state.searchState.searchIndex]);

  const highlightedLine =
    state.searchState.searchIndex !== undefined
      ? searchResults[state.searchState.searchIndex]
      : undefined;

  const memoizedContext = useMemo(
    () => ({
      fileName: state.fileName,
      hasSearch: !!state.searchState.searchTerm,
      lineCount: state.logs.length,
      processedLogLines,
      searchState: state.searchState,
      hasLogs: !!state.logs.length,
      selectedLine: state.lineNumber,
      listRef,
      highlightedLine,
      clearLogs: () => dispatch({ type: "CLEAR_LOGS" }),
      getLine,
      ingestLines: (lines: string[], logType: LogTypes) => {
        dispatch({ type: "INGEST_LOGS", logs: lines, logType });
      },
      setFileName: (fileName: string) => {
        dispatch({ type: "SET_FILE_NAME", fileName });
      },
      setSearch: (searchTerm: string) => {
        dispatch({ type: "SET_SEARCH_TERM", searchTerm, caseSensitive });
      },
      scrollToLine,
      paginate: (direction: DIRECTION) => {
        dispatch({ type: "PAGINATE", direction });
      },
    }),
    [
      state.fileName,
      state.searchState,
      state.logs.length,
      state.lineNumber,
      processedLogLines,
      highlightedLine,
      getLine,
      scrollToLine,
      dispatch,
      caseSensitive,
    ]
  );

  return (
    <LogContext.Provider value={memoizedContext}>
      {children}
    </LogContext.Provider>
  );
};

export { LogContextProvider, useLogContext };
