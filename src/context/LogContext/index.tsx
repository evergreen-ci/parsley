import { createContext, useCallback, useContext, useMemo } from "react";
import useLogState from "./state";

interface LogContextState {
  logLines: string[];
  lineCount: number;
  hasLogs: boolean;
  fileName?: string;
  ingestLines: (logs: string[]) => void;
  getLine: (lineNumber: number) => string | undefined;
  setFileName: (fileName: string) => void;
  clearLogs: () => void;
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
    (lines: string[]) => {
      dispatch({ type: "INGEST_LOGS", logs: lines });
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
  const memoizedContext = useMemo(
    () => ({
      logLines: state.logs,
      lineCount: state.logs.length,
      fileName: state.fileName,
      hasLogs: state.logs.length > 0,
      clearLogs,
      setFileName,
      getLine,
      ingestLines,
    }),
    [state.logs, state.fileName, setFileName, ingestLines, getLine, clearLogs]
  );

  return (
    <LogContext.Provider value={memoizedContext}>
      {children}
    </LogContext.Provider>
  );
};

export { LogContextProvider, useLogContext };
