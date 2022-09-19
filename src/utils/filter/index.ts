import { FilterLogic } from "constants/queryParams";

/**
 * Function that determines if a particular log line satisfies the filter conditions.
 * @param logLine - string representing a log line
 * @param filters - list of filters being applied
 * @param filterLogic - specifies whether to use AND or OR filtering
 * @returns true if filter conditions are satisfied, false otherwise
 */
export const matchesFilter = (
  logLine: string,
  filters: string[],
  filterLogic: FilterLogic
) => {
  const regexFilter =
    filterLogic === FilterLogic.And
      ? filters.map((f) => `(?=^.*${f})`).join("")
      : filters.join("|");

  return !!logLine.match(new RegExp(regexFilter, "i"));
};

/**
 * Function that processes log lines according to what filters, bookmarks, and selected line are applied.
 * @param logLines - list of strings representing the log lines
 * @param filters  - list of strings representing the filters being applied
 * @param bookmarks - list of line numbers representing bookmarks
 * @param selectedLine - a line number representing a selected line
 * @param filterLogic - specifies whether to use AND or OR when applying filters
 * @returns an array of numbers that indicates which log lines should be displayed, and which log lines
 * should be collapsed
 */
export const filterLogs = (
  logLines: string[],
  filters: string[],
  bookmarks: number[],
  selectedLine: number | undefined,
  filterLogic: FilterLogic
): (number | number[])[] => {
  if (filters.length === 0) {
    return [...Array(logLines.length).keys()];
  }

  const filteredLines: (number | number[])[] = [];

  logLines.reduce((arr, logLine, idx) => {
    // Bookmarks and selected lines should always remain uncollapsed.
    if (bookmarks.includes(idx) || selectedLine === idx) {
      arr.push(idx);
      return arr;
    }

    // Determine if a line should be displayed or collapsed depending on if it matches the filter.
    const hasMatch = matchesFilter(logLine, filters, filterLogic);

    if (hasMatch) {
      arr.push(idx);
    } else {
      const previousItem = arr[arr.length - 1];
      if (Array.isArray(previousItem)) {
        previousItem.push(idx);
      } else {
        arr.push([idx]);
      }
    }
    return arr;
  }, filteredLines);

  return filteredLines;
};
