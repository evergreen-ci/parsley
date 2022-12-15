import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Cookie from "js-cookie";
import { List } from "react-virtualized";
import { cache } from "components/LogRow/RowRenderer";
import {
  CASE_SENSITIVE,
  EXPANDABLE_ROWS,
  FILTER_LOGIC,
  PRETTY_PRINT_BOOKMARKS,
  WRAP,
} from "constants/cookies";
import { FilterLogic, LogTypes } from "constants/enums";
import { QueryParams } from "constants/queryParams";
import { useFilterParam } from "hooks/useFilterParam";
import { useQueryParam } from "hooks/useQueryParam";
import { ExpandedLines, ProcessedLogLines } from "types/logs";
import filterLogs from "utils/filterLogs";
import { getMatchingLines } from "utils/matchingLines";
import { getColorMapping } from "utils/resmoke";
import searchLogs from "utils/searchLogs";
import useLogState from "./state";
import { DIRECTION, LogMetadata, SearchState } from "./types";
import { getNextPage } from "./utils";

interface LogContextState {
  expandableRows: boolean;
  expandedLines: ExpandedLines;
  filterLogic: FilterLogic;
  hasLogs: boolean;
  highlightedLine?: number;
  lineCount: number;
  listRef: React.RefObject<List>;
  logMetadata?: LogMetadata;
  matchingLines: Set<number> | undefined;
  prettyPrint: boolean;
  processedLogLines: ProcessedLogLines;
  range: {
    lowerRange: number;
    upperRange?: number;
  };
  searchState: SearchState;
  wrap: boolean;

  clearExpandedLines: () => void;
  clearLogs: () => void;
  collapseLines: (idx: number) => void;
  expandLines: (expandedLines: ExpandedLines) => void;
  getLine: (lineNumber: number) => string | undefined;
  getResmokeLineColor: (lineNumber: number) => string | undefined;
  ingestLines: (logs: string[], logType: LogTypes) => void;
  paginate: (dir: DIRECTION) => void;
  resetRowHeightAtIndex: (index: number) => void;
  scrollToLine: (lineNumber: number) => void;
  setCaseSensitive: (caseSensitive: boolean) => void;
  setExpandableRows: (expandableRows: boolean) => void;
  setFileName: (fileName: string) => void;
  setFilterLogic: (filterLogic: FilterLogic) => void;
  setLogMetadata: (logMetadata: LogMetadata) => void;
  setSearch: (search: string) => void;
  setWrap: (wrap: boolean) => void;
  togglePrettyPrint: (prettyPrint: boolean) => void;
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
  const [filters] = useFilterParam();
  const [bookmarks] = useQueryParam<number[]>(QueryParams.Bookmarks, []);
  const [selectedLine] = useQueryParam<number | undefined>(
    QueryParams.SelectedLine,
    undefined
  );
  const [upperRange] = useQueryParam<undefined | number>(
    QueryParams.UpperRange,
    undefined
  );
  const [lowerRange] = useQueryParam(QueryParams.LowerRange, 0);

  const [wrap, setWrap] = useState(Cookie.get(WRAP) === "true");
  const [filterLogic, setFilterLogic] = useQueryParam(
    QueryParams.FilterLogic,
    (Cookie.get(FILTER_LOGIC) as FilterLogic) ?? FilterLogic.And
  );
  const [expandableRows, setExpandableRows] = useQueryParam(
    QueryParams.Expandable,
    Cookie.get(EXPANDABLE_ROWS) ? Cookie.get(EXPANDABLE_ROWS) === "true" : true
  );
  const [prettyPrint, setPrettyPrint] = useState(
    Cookie.get(PRETTY_PRINT_BOOKMARKS) === "true"
  );

  const { state, dispatch } = useLogState(initialLogLines);
  const [processedLogLines, setProcessedLogLines] = useState<ProcessedLogLines>(
    []
  );

  const listRef = useRef<List>(null);

  const stringifiedFilters = JSON.stringify(filters);
  const stringifiedBookmarks = bookmarks.toString();
  const stringifiedExpandedLines = state.expandedLines.toString();

  const matchingLines = useMemo(
    () => getMatchingLines(state.logs, filters, filterLogic),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      stringifiedFilters,
      stringifiedExpandedLines,
      state.logs.length,
      filterLogic,
    ]
  );

  useEffect(
    () => {
      setProcessedLogLines(
        filterLogs({
          logLines: state.logs,
          matchingLines,
          bookmarks,
          selectedLine,
          expandedLines: state.expandedLines,
          expandableRows,
        })
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      state.logs.length,
      matchingLines,
      stringifiedBookmarks,
      selectedLine,
      stringifiedExpandedLines,
      expandableRows,
    ]
  );

  const getLine = useCallback(
    (lineNumber: number) => state.logs[lineNumber],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.logs.length]
  );

  const getResmokeLineColor = useCallback(
    (lineNumber: number) => {
      const lineContent = getLine(lineNumber);
      if (!state.colorMapping || !lineContent) {
        return undefined;
      }
      const colorMapping = getColorMapping(lineContent, state.colorMapping);
      return colorMapping !== undefined ? colorMapping.color : undefined;
    },
    [getLine, state.colorMapping]
  );

  const scrollToLine = useCallback((lineNumber: number) => {
    // We need to call scrollToRow twice because of https://github.com/bvaughn/react-virtualized/issues/995.
    // When we switch to a different virtual list library we should not do this.
    listRef.current?.scrollToRow(lineNumber);
    setTimeout(() => {
      listRef.current?.scrollToRow(lineNumber);
    }, 0);
  }, []);

  const searchResults = useMemo(() => {
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
    state.searchState.searchTerm,
    processedLogLines,
    upperRange,
    lowerRange,
    getLine,
    dispatch,
  ]);

  const stringifiedSearchResults = searchResults.toString();
  useEffect(() => {
    if (searchResults.length > 0) {
      scrollToLine(searchResults[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stringifiedSearchResults, scrollToLine]);

  const highlightedLine =
    state.searchState.searchIndex !== undefined
      ? searchResults[state.searchState.searchIndex]
      : undefined;

  const memoizedContext = useMemo(
    () => ({
      expandableRows,
      expandedLines: state.expandedLines,
      filterLogic,
      hasLogs: !!processedLogLines.length,
      hasSearch: !!state.searchState.searchTerm,
      highlightedLine,
      lineCount: state.logs.length,
      logMetadata: state.logMetadata,
      listRef,
      matchingLines,
      prettyPrint,
      processedLogLines,
      range: {
        lowerRange,
        upperRange,
      },
      searchState: state.searchState,
      wrap,

      clearExpandedLines: () => dispatch({ type: "CLEAR_EXPANDED_LINES" }),
      clearLogs: () => dispatch({ type: "CLEAR_LOGS" }),
      collapseLines: (idx: number) => dispatch({ type: "COLLAPSE_LINES", idx }),
      expandLines: (expandedLines: ExpandedLines) =>
        dispatch({ type: "EXPAND_LINES", expandedLines }),
      getLine,
      getResmokeLineColor,
      ingestLines: (lines: string[], logType: LogTypes) => {
        dispatch({ type: "INGEST_LOGS", logs: lines, logType });
      },
      paginate: (direction: DIRECTION) => {
        const { searchIndex, searchRange } = state.searchState;
        if (searchIndex !== undefined && searchRange !== undefined) {
          const nextPage = getNextPage(searchIndex, searchRange, direction);
          dispatch({ type: "PAGINATE", nextPage });
          scrollToLine(searchResults[nextPage]);
        }
      },
      resetRowHeightAtIndex: (index: number) => {
        listRef.current?.recomputeRowHeights(index);
        cache.clear(index, 0);
      },
      scrollToLine,

      setCaseSensitive: (caseSensitive: boolean) => {
        dispatch({ type: "SET_CASE_SENSITIVE", caseSensitive });
        Cookie.set(CASE_SENSITIVE, caseSensitive.toString(), { expires: 365 });
      },
      setExpandableRows,
      setFileName: (fileName: string) => {
        dispatch({ type: "SET_FILE_NAME", fileName });
      },
      setFilterLogic,
      setLogMetadata: (logMetadata: LogMetadata) => {
        dispatch({ type: "SET_LOG_METADATA", logMetadata });
      },
      setSearch: (searchTerm: string) => {
        dispatch({ type: "SET_SEARCH_TERM", searchTerm });
      },
      setWrap,
      togglePrettyPrint: (v: boolean) => {
        setPrettyPrint(v);
        Cookie.set(PRETTY_PRINT_BOOKMARKS, v.toString(), { expires: 365 });
      },
    }),
    [
      wrap,
      setWrap,
      filterLogic,
      setFilterLogic,
      expandableRows,
      setExpandableRows,
      state.expandedLines,
      state.logMetadata,
      state.logs.length,
      state.searchState,
      highlightedLine,
      lowerRange,
      matchingLines,
      prettyPrint,
      processedLogLines,
      searchResults,
      upperRange,
      dispatch,
      getLine,
      getResmokeLineColor,
      scrollToLine,
    ]
  );

  return (
    <LogContext.Provider value={memoizedContext}>
      {children}
    </LogContext.Provider>
  );
};

export { LogContextProvider, useLogContext };
