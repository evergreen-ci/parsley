import { createContext, useCallback, useContext, useMemo } from "react";
import useLogState from "./state";

interface LogContextState {
  logLines: string[];
  lineCount: number;
  ingestLines: (logs: string[]) => void;
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

const LogContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { state, dispatch } = useLogState();

  const ingestLines = useCallback(
    (lines: string[]) => {
      dispatch({ type: "INGEST_LOGS", logs: lines });
    },
    [dispatch]
  );

  const clearLines = useCallback(() => {
    dispatch({ type: "CLEAR_LOGS" });
  }, [dispatch]);

  const memoizedContext = useMemo(
    () => ({
      logLines: state.logs,
      lineCount: state.lineCount,
      clearLines,
      ingestLines,
    }),
    [state.logs, state.lineCount, ingestLines, clearLines]
  );

  return (
    <LogContext.Provider value={memoizedContext}>
      {children}
    </LogContext.Provider>
  );
};

export { LogContextProvider, useLogContext };
