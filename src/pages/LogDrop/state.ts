import { useReducer } from "react";

type CurrentState =
  | "WAITING_FOR_FILE"
  | "LOADING_FILE"
  | "PROMPT_FOR_PARSING_METHOD"
  | "FILE_ERROR";

type State = {
  currentState: CurrentState;
  file: File | null;
  text: string | null;
  type: "file" | "text" | null;
};
type Action =
  | { type: "DROPPED_FILE"; file: File }
  | { type: "PASTED_TEXT"; text: string }
  | { type: "PARSE_FILE" }
  | { type: "CANCEL" };

const initialState = (): State => ({
  currentState: "WAITING_FOR_FILE",
  file: null,
  text: null,
  type: null,
});

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "DROPPED_FILE":
      return {
        ...state,
        currentState: "PROMPT_FOR_PARSING_METHOD",
        file: action.file,
        type: "file",
      };
    case "PARSE_FILE":
      return {
        ...state,
        currentState: "LOADING_FILE",
      };
    case "PASTED_TEXT":
      return {
        ...state,
        currentState: "PROMPT_FOR_PARSING_METHOD",
        text: action.text,
        type: "text",
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
    dispatch,
    state,
  };
};

export default useLogDropState;
