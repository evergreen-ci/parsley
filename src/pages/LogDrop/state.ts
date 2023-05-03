import { useReducer } from "react";

type CurrentState =
  | "WAITING_FOR_FILE"
  | "LOADING_FILE"
  | "PROMPT_FOR_PARSING_METHOD"
  | "FILE_ERROR";

type State = {
  currentState: CurrentState;
  file: File | null;
  parsingMethod: string | null;
  error: Error | null;
  fileName: string | null;
};
type Action =
  | { type: "DROPPED_FILE"; file: File }
  | { type: "PARSE_FILE" }
  | { type: "CANCEL" };

const initialState = (): State => ({
  currentState: "WAITING_FOR_FILE",
  file: null,
  parsingMethod: null,
  error: null,
  fileName: null,
});

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "DROPPED_FILE":
      return {
        ...state,
        currentState: "PROMPT_FOR_PARSING_METHOD",
        file: action.file,
        fileName: action.file.name,
      };
    case "PARSE_FILE":
      return {
        ...state,
        currentState: "LOADING_FILE",
      };
    case "CANCEL":
      return initialState();
    default:
      throw new Error(`Unknown reducer action ${action}`);
  }
};

const useLogDropState = () => {
  const [state, dispatch] = useReducer(reducer, initialState());
  return {
    state,
    dispatch,
  };
};

export default useLogDropState;
