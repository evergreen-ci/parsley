import { FilterLogic } from "constants/enums";
import { ExpandedLines, ProcessedLogLines } from "types/logs";
import { isCollapsedRow } from "utils/collapsedRow";
import { isExpanded } from "utils/expandedRanges";

type FilterLogsParams = {
  logLines: string[];
  filters: string[];
  bookmarks: number[];
  selectedLine: number | undefined;
  expandedLines: ExpandedLines;
  filterLogic: FilterLogic;
  expandableRows: boolean;
};

/**
 * `filterLogs` processes log lines according to what filters, bookmarks, and selected line are applied.
 * @param {string[]} obj.logLines - list of strings representing the log lines
 * @param {string[]} obj.filters  - list of strings representing the filters being applied
 * @param {number[]} obj.bookmarks - list of line numbers representing bookmarks
 * @param {number | undefined} obj.selectedLine - a line number representing a selected line
 * @param {ExpandedLines} obj.expandedLines - an array of intervals representing expanded ranges
 * @param {FilterLogic} obj.filterLogic - specifies whether to use AND or OR when applying filters
 * @param {boolean} obj.expandableRows - specifies if expandable rows is enabled
 * @returns an array of numbers that indicates which log lines should be displayed, and which log lines
 * should be collapsed
 */
export const filterLogs = ({
  logLines,
  filters,
  bookmarks,
  selectedLine,
  expandedLines,
  filterLogic,
  expandableRows,
}: FilterLogsParams): (number | number[])[] => {
  // If there are no filters or expandable rows is not enabled, then we don't have to do any
  // processing.
  if (filters.length === 0 || !expandableRows) {
    return logLines.map((_, idx) => idx);
  }

  const filteredLines: ProcessedLogLines = [];

  logLines.reduce((arr, logLine, idx) => {
    // Bookmarks and selected lines should always remain uncollapsed.
    if (
      bookmarks.includes(idx) ||
      selectedLine === idx ||
      isExpanded(idx, expandedLines)
    ) {
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
