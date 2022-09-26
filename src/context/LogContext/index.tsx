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
import { filterLogs } from "utils/filter";
import useLogState from "./state";

interface LogContextState {
  fileName?: string;
  hasLogs: boolean;
  lineCount: number;
  matchingSearchCount: number;
  processedLogLines: (number | number[])[];
  hasSearch: boolean;
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

  const { state, dispatch } = useLogState(initialLogLines);

  const ingestLines = useCallback(
    (lines: string[], logType: LogTypes) => {
      dispatch({ type: "INGEST_LOGS", logs: lines, logType });
    },
    [dispatch]
  );

  const clearLogs = useCallback(() => {
    dispatch({ type: "CLEAR_LOGS" });
  }, [dispatch]);

  const getLine = useCallback(
    (lineNumber: number) => state.logs[lineNumber],
    [state.logs]
  );

  const setFileName = useCallback(
    (fileName: string) => {
      dispatch({ type: "SET_FILE_NAME", fileName });
    },
    [dispatch]
  );

  const setSearch = useCallback(
    (search: string) => {
      dispatch({ type: "SET_SEARCH", search });
    },
    [dispatch]
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
  }, [state.logs.length > 0, selectedLine, scrollToLine]);

  // TODO EVG-17537: more advanced filtering
  const processedLogLines = useMemo(
    () => filterLogs(state.logs, filters, bookmarks, selectedLine, filterLogic),
    [state.logs, filters, bookmarks, selectedLine, filterLogic]
  );

  const hasSearch = useMemo(() => !!state.search, [state.search]);
  const searchResults = useMemo(() => {
    // search through processedLoglines
    // return the line number of the first match
    // if no match, return undefined
    const matchingIndices = [];
    if (state.search === undefined) return [];
    for (let i = 0; i < processedLogLines.length; i++) {
      const lineIndex = processedLogLines[i];
      if (!Array.isArray(lineIndex)) {
        const line = getLine(lineIndex);
        if (line?.match(state?.search || "")) {
          matchingIndices.push(lineIndex);
        }
      }
    }
    return matchingIndices;
  }, [state.search, processedLogLines, getLine]);

  const memoizedContext = useMemo(
    () => ({
      lineCount: state.logs.length,
      fileName: state.fileName,
      hasLogs: state.logs.length > 0,
      processedLogLines,
      hasSearch,
      matchingSearchCount: searchResults.length,
      clearLogs,
      getLine,
      ingestLines,
      setFileName,
      setSearch,
      scrollToLine,
    }),
    [
      state.logs.length,
      state.fileName,
      processedLogLines,
      searchResults.length,
      hasSearch,
      clearLogs,
      getLine,
      ingestLines,
      setFileName,
      setSearch,
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
