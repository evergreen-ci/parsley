import { FilterLogic } from "constants/enums";
import { ExpandedLines, ProcessedLogLines } from "types/logs";
import { isCollapsedRow } from "utils/collapsedRow";
import { isExpanded } from "utils/expandedLines";

type FilterLogsParams = {
  logLines: string[];
  matchingLines: Set<number> | undefined;
  bookmarks: number[];
  selectedLine: number | undefined;
  expandedLines: ExpandedLines;
  expandableRows: boolean;
};

/**
 * `filterLogs` processes log lines according to what filters, bookmarks, selected line, and expanded lines are applied.
 * @param {string[]} obj.logLines - list of strings representing the log lines
 * @param {Set<number>} obj.matchingLines - set of numbers representing which lines match the applied filters
 * @param {number[]} obj.bookmarks - list of line numbers representing bookmarks
 * @param {number | undefined} obj.selectedLine - a line number representing a selected line
 * @param {ExpandedLines} obj.expandedLines - an array of intervals representing expanded ranges
 * @param {boolean} obj.expandableRows - specifies if expandable rows is enabled
 * @returns an array of numbers that indicates which log lines should be displayed, and which log lines
 * should be collapsed
 */
export const filterLogs = ({
  logLines,
  matchingLines,
  bookmarks,
  selectedLine,
  expandedLines,
  expandableRows,
}: FilterLogsParams): (number | number[])[] => {
  // If there are no filters or expandable rows is not enabled, then we don't have to do any
  // processing.
  if (matchingLines === undefined || !expandableRows) {
    return logLines.map((_, idx) => idx);
  }

  const filteredLines: ProcessedLogLines = [];

  logLines.reduce((arr, _logLine, idx) => {
    // Bookmarks, selected lines, and expanded lines should always remain uncollapsed.
    if (
      bookmarks.includes(idx) ||
      selectedLine === idx ||
      isExpanded(idx, expandedLines)
    ) {
      arr.push(idx);
      return arr;
    }

    // If the line matches the filters, it should remain uncollapsed.
    if (matchingLines.has(idx)) {
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
 * 'getMatchingLines' determines which log lines match the applied filters. This function returns undefined if no
 * filters have been applied.
 * @param logLines - list of strings representing the log lines
 * @param filters - list of filters being applied
 * @param filterLogic - specifies whether to use AND or OR filtering
 * @returns a set of numbers representing the matched lines, or undefined
 */
export const getMatchingLines = (
  logLines: string[],
  filters: string[],
  filterLogic: FilterLogic
) => {
  const set = new Set<number>();

  if (filters.length === 0) {
    return undefined;
  }

  const regexToMatch: RegExp[] = filters.map((f) => new RegExp(f, "i"));
  logLines.forEach((line, idx) => {
    if (filterLogic === FilterLogic.And) {
      if (regexToMatch.every((regex) => line.match(regex))) {
        set.add(idx);
      }
    } else if (regexToMatch.some((regex) => line.match(regex))) {
      set.add(idx);
    }
  });

  return set;
};
