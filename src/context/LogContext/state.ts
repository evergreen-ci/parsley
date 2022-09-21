import { useReducer } from "react";
import { LogTypes } from "constants/enums";
import { processResmokeLine } from "utils/resmoke";

interface LogState {
  logs: string[];
  fileName?: string;
  logType?: LogTypes;
}

type Action =
  | { type: "INGEST_LOGS"; logs: string[]; logType: LogTypes }
  | { type: "CLEAR_LOGS" }
  | { type: "SET_FILE_NAME"; fileName: string };

const initialState = (initialLogLines?: string[]): LogState => ({
  logs: initialLogLines || [],
});

const reducer = (state: LogState, action: Action): LogState => {
  switch (action.type) {
    case "INGEST_LOGS": {
      let processedLogs = action.logs;
      switch (action.logType) {
        case LogTypes.RESMOKE_LOGS:
          processedLogs = action.logs.map(processResmokeLine);
          break;
        default:
          break;
      }
      return {
        ...state,
        logs: processedLogs,
        logType: action.logType,
      };
    }
    case "CLEAR_LOGS":
      return {
        ...state,
        logs: [],
        fileName: "",
        logType: undefined,
      };
    case "SET_FILE_NAME":
      return {
        ...state,
        fileName: action.fileName,
      };
    default:
      throw new Error(`Unkown reducer action ${action}`);
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
