import { useReducer } from "react";

interface LogState {
  logs: string[];
}

type Action = { type: "INGEST_LOGS"; logs: string[] } | { type: "CLEAR_LOGS" };

const initialState: LogState = {
  logs: [],
};

const reducer = (state: LogState, action: Action) => {
  switch (action.type) {
    case "INGEST_LOGS":
      return {
        ...state,
        logs: action.logs,
      };
    case "CLEAR_LOGS":
      return {
        ...state,
        logs: [],
      };
    default:
      throw new Error(`Unkown reducer action ${action}`);
  }
};

const useLogState = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return {
    state,
    dispatch,
  };
};

export default useLogState;
