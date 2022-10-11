import { FilterLogic } from "constants/queryParams";
import { ProcessedLogLines } from "types/logs";
import { isCollapsedRow } from "utils/collapsedRow";

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

  return new RegExp(regexFilter, "i").test(logLine);
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
): ProcessedLogLines => {
  if (filters.length === 0) {
    return logLines.map((_, idx) => idx);
  }

  const filteredLines: ProcessedLogLines = [];

  logLines.reduce((arr, logLine, idx) => {
    // Bookmarks and selected lines should always remain uncollapsed.
    if (bookmarks.includes(idx) || selectedLine === idx) {
      arr.push(idx);
      return arr;
    }

    // If the line matches the filters, it should remain uncollapsed.
    if (matchesFilter(logLine, filters, filterLogic)) {
      arr.push(idx);
      return arr;
    }

    // If the line doesn't match the filters, collapse it.
    const previousItem = arr[arr.length - 1];
    if (isCollapsedRow(previousItem)) {
      previousItem.push(idx);
    } else {
      arr.push([idx]);
    }
    return arr;
  }, filteredLines);

  return filteredLines;
};
