import { useReducer } from "react";
import { Filter } from "types/logs";

type Action =
  | { type: "ADD_FILTER"; filterToAdd: Filter }
  | { type: "REMOVE_FILTER"; filterToRemove: string }
  | { type: "RESET" };

type State = {
  selectedFilters: Filter[];
};

const initialState = (): State => ({
  selectedFilters: [],
});

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_FILTER":
      return {
        ...state,
        selectedFilters: [...state.selectedFilters, action.filterToAdd],
      };
    case "REMOVE_FILTER":
      return {
        ...state,
        selectedFilters: state.selectedFilters.filter(
          (f) => f.name !== action.filterToRemove
        ),
      };
    case "RESET":
      return initialState();
    default:
      throw new Error(`Unknown reducer action ${action}`);
  }
};

const useSelectedFiltersState = () => {
  const [state, dispatch] = useReducer(reducer, initialState());
  return {
    state,
    dispatch,
  };
};

export default useSelectedFiltersState;
