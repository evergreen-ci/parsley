import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { LogTypes } from "constants/enums";
import { FilterLogic, QueryParams } from "constants/queryParams";
import { useQueryParam } from "hooks/useQueryParam";
import { ProcessedLogLines } from "types/logs";
import { filterLogs } from "utils/filter";
import { searchLogs } from "utils/search";
import useLogState from "./state";

interface LogContextState {
  fileName?: string;
  hasLogs: boolean;
  hasSearch: boolean;
  lineCount: number;
  matchingSearchCount: number;
  processedLogLines: ProcessedLogLines;
  search?: string;
  selectedLine?: number;
  clearLogs: () => void;
  getLine: (lineNumber: number) => string | undefined;
  ingestLines: (logs: string[], logType: LogTypes) => void;
  scrollToLine: (lineNumber: number) => void;
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
  const [caseSensitive] = useQueryParam(QueryParams.CaseSensitive, false);
  const [upperRange] = useQueryParam<undefined | number>(
    QueryParams.UpperRange,
    undefined
  );
  const [lowerRange] = useQueryParam(QueryParams.LowerRange, 0);

  const { state, dispatch } = useLogState(initialLogLines);

  const getLine = useCallback(
    (lineNumber: number) => state.logs[lineNumber],
    [state.logs]
  );

  const scrollToLine = useCallback(
    (lineNumber: number) => {
      dispatch({ type: "SCROLL_TO_LINE", lineNumber });
    },
    [dispatch]
  );

  useEffect(() => {
    if (selectedLine) {
      scrollToLine(selectedLine);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.logs.length > 0, selectedLine]);

  // TODO EVG-17537: more advanced filtering
  const processedLogLines = useMemo(
    () => filterLogs(state.logs, filters, bookmarks, selectedLine, filterLogic),
    [state.logs, filters, bookmarks, selectedLine, filterLogic]
  );

  const searchResults = useMemo(
    () =>
      // search through processedLoglines
      // return the line number of the first match
      // if no match, return undefined
      state.search
        ? searchLogs({
            search: state.search,
            processedLogLines,
            caseSensitive,
            upperBound: upperRange,
            lowerBound: lowerRange,
            getLine,
          })
        : [],
    [
      state.search,
      caseSensitive,
      upperRange,
      lowerRange,
      processedLogLines,
      getLine,
    ]
  );

  const memoizedContext = useMemo(
    () => ({
      fileName: state.fileName,
      hasLogs: state.logs.length > 0,
      hasSearch: !!state.search,
      lineCount: state.logs.length,
      matchingSearchCount: searchResults.length,
      processedLogLines,
      search: state.search,
      clearLogs: () => dispatch({ type: "CLEAR_LOGS" }),
      getLine,
      ingestLines: (lines: string[], logType: LogTypes) => {
        dispatch({ type: "INGEST_LOGS", logs: lines, logType });
      },
      setFileName: (fileName: string) => {
        dispatch({ type: "SET_FILE_NAME", fileName });
      },
      setSearch: (search: string) => {
        dispatch({ type: "SET_SEARCH", search });
      },
      scrollToLine,
    }),
    [
      state.logs.length,
      state.fileName,
      state.search,
      processedLogLines,
      searchResults.length,
      getLine,
      scrollToLine,
      dispatch,
    ]
  );

  return (
    <LogContext.Provider value={memoizedContext}>
      {children}
    </LogContext.Provider>
  );
};

export { LogContextProvider, useLogContext };
