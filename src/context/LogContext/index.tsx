import { createContext, useCallback, useContext, useMemo } from "react";
import useLogState from "./state";

interface LogContextState {
  logLines: string[];
  lineCount: number;
  hasLogs: boolean;
  ingestLines: (logs: string[]) => void;
  getLine: (lineNumber: number) => string | undefined;
  clearLines: () => void;
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

  const clearLines = useCallback(() => {
    dispatch({ type: "CLEAR_LOGS" });
  }, [dispatch]);

  const getLine = useCallback(
    (lineNumber: number) => state.logs[lineNumber],
    [state.logs]
  );
  const memoizedContext = useMemo(
    () => ({
      logLines: state.logs,
      lineCount: state.logs.length,
      hasLogs: state.logs.length > 0,
      clearLines,
      getLine,
      ingestLines,
    }),
    [state.logs, ingestLines, getLine, clearLines]
  );

  return (
    <LogContext.Provider value={memoizedContext}>
      {children}
    </LogContext.Provider>
  );
};

export { LogContextProvider, useLogContext };
