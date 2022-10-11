import { createContext, useCallback, useContext, useMemo, useRef } from "react";
import { List } from "react-virtualized";
import { LogTypes } from "constants/enums";
import { FilterLogic, QueryParams } from "constants/queryParams";
import { useQueryParam } from "hooks/useQueryParam";
import { ExpandedLines, ProcessedLogLines } from "types/logs";
import { filterLogs } from "utils/filter";
import searchLogs from "utils/searchLogs";
import useLogState from "./state";
import { DIRECTION, SearchState } from "./types";
import { getNextPage } from "./utils";

interface LogContextState {
  expandedLines: ExpandedLines;
  fileName?: string;
  hasLogs: boolean;
  highlightedLine?: number;
  lineCount: number;
  listRef: React.RefObject<List>;
  processedLogLines: ProcessedLogLines;
  range: {
    lowerRange: number;
    upperRange?: number;
  };
  searchState: SearchState;

  clearLogs: () => void;
  collapseLines: (idx: number) => void;
  expandLines: (expandedLines: ExpandedLines) => void;
  getLine: (lineNumber: number) => string | undefined;
  ingestLines: (logs: string[], logType: LogTypes) => void;
  paginate: (dir: DIRECTION) => void;
  scrollToLine: (lineNumber: number) => void;
  setCaseSensitive: (caseSensitive: boolean) => void;
  setFileName: (fileName: string) => void;
  setSearch: (search: string) => void;
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
  const [upperRange] = useQueryParam<undefined | number>(
    QueryParams.UpperRange,
    undefined
  );
  const [lowerRange] = useQueryParam(QueryParams.LowerRange, 0);
  const [expandableRows] = useQueryParam(QueryParams.Expandable, false);
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
    () =>
      filterLogs({
        logLines: state.logs,
        filters,
        bookmarks,
        selectedLine,
        filterLogic,
        expandedLines: state.expandedLines,
        expandableRows,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      state.logs.length,
      `${filters}`, // eslint-disable-line react-hooks/exhaustive-deps
      `${bookmarks}`, // eslint-disable-line react-hooks/exhaustive-deps
      `${state.expandedLines}`, // eslint-disable-line react-hooks/exhaustive-deps
      selectedLine,
      filterLogic,
      expandableRows,
    ]
  );

  const searchResults = useMemo(() => {
    // search through processedLoglines
    // return the line number of the first match
    // if no match, return undefined
    const results = state.searchState.searchTerm
      ? searchLogs({
          searchRegex: state.searchState.searchTerm,
          processedLogLines,
          upperBound: upperRange,
          lowerBound: lowerRange,
          getLine,
        })
      : [];
    dispatch({
      type: "SET_MATCH_COUNT",
      matchCount: results.length,
    });
    return results;
  }, [
    dispatch,
    state.searchState.searchTerm,
    upperRange,
    lowerRange,
    processedLogLines,
    getLine,
  ]);

  const highlightedLine =
    state.searchState.searchIndex !== undefined
      ? searchResults[state.searchState.searchIndex]
      : undefined;

  const memoizedContext = useMemo(
    () => ({
      expandedLines: state.expandedLines,
      expandLines: (expandedLines: ExpandedLines) =>
        dispatch({ type: "EXPAND_LINES", expandedLines }),
      collapseLines: (idx: number) => dispatch({ type: "COLLAPSE_LINES", idx }),
      fileName: state.fileName,
      hasSearch: !!state.searchState.searchTerm,
      lineCount: state.logs.length,
      processedLogLines,
      searchState: state.searchState,
      hasLogs: !!state.logs.length,
      range: {
        lowerRange,
        upperRange,
      },
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
        dispatch({ type: "SET_SEARCH_TERM", searchTerm });
      },
      scrollToLine,
      paginate: (direction: DIRECTION) => {
        const { searchIndex, searchRange } = state.searchState;
        if (searchIndex !== undefined && searchRange !== undefined) {
          const nextPage = getNextPage(searchIndex, searchRange, direction);
          dispatch({ type: "PAGINATE", nextPage });
          scrollToLine(searchResults[nextPage]);
        }
      },
      setCaseSensitive: (caseSensitive: boolean) => {
        dispatch({ type: "SET_CASE_SENSITIVE", caseSensitive });
      },
    }),
    [
      state.expandedLines,
      state.fileName,
      state.searchState,
      state.logs.length,
      processedLogLines,
      lowerRange,
      upperRange,
      highlightedLine,
      getLine,
      scrollToLine,
      dispatch,
      searchResults,
    ]
  );

  return (
    <LogContext.Provider value={memoizedContext}>
      {children}
    </LogContext.Provider>
  );
};

export { LogContextProvider, useLogContext };
