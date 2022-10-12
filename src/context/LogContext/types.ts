interface SearchState {
  searchTerm?: RegExp;
  searchIndex?: number;
  searchRange?: number;
  hasSearch: boolean;
  caseSensitive: boolean;
}

enum DIRECTION {
  PREVIOUS,
  NEXT,
}

export { DIRECTION };
export type { SearchState };
