enum QueryParams {
  Search = "search",
  Highlights = "highlights",
  Bookmarks = "bookmarks",
  Filters = "filters",
  SelectedLine = "selectedLine",
  Wrap = "wrap",
  FilterLogic = "filterLogic",
}

enum FilterLogic {
  And = "and",
  Or = "or",
}

export { QueryParams, FilterLogic };
