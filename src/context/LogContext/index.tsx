import { createContext, useCallback, useContext, useMemo } from "react";
import { LogTypes } from "constants/enums";
import { ExpandedLines } from "types/logs";
import useLogState from "./state";

interface LogContextState {
  logLines: string[];
  lineCount: number;
  hasLogs: boolean;
  fileName?: string;
  expandedLines: ExpandedLines;
  ingestLines: (logs: string[], logType: LogTypes) => void;
  getLine: (lineNumber: number) => string | undefined;
  setFileName: (fileName: string) => void;
  clearLogs: () => void;
  setExpandedLines: (expandedLines: ExpandedLines) => void;
  collapseLines: (idx: number) => void;
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

  const setExpandedLines = useCallback(
    (expandedLines: ExpandedLines) => {
      dispatch({ type: "EXPAND_LINES", expandedLines });
    },
    [dispatch]
  );

  const collapseLines = useCallback(
    (idx: number) => {
      dispatch({ type: "COLLAPSE_LINES", idx });
    },
    [dispatch]
  );

  const setFileName = useCallback(
    (fileName: string) => {
      dispatch({ type: "SET_FILE_NAME", fileName });
    },
    [dispatch]
  );

  const memoizedContext = useMemo(
    () => ({
      logLines: state.logs,
      lineCount: state.logs.length,
      fileName: state.fileName,
      expandedLines: state.expandedLines,
      hasLogs: state.logs.length > 0,
      clearLogs,
      setFileName,
      getLine,
      ingestLines,
      setExpandedLines,
      collapseLines,
    }),
    [
      state.logs,
      state.fileName,
      state.expandedLines,
      setFileName,
      ingestLines,
      getLine,
      clearLogs,
      setExpandedLines,
      collapseLines,
    ]
  );

  return (
    <LogContext.Provider value={memoizedContext}>
      {children}
    </LogContext.Provider>
  );
};

export { LogContextProvider, useLogContext };
