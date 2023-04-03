import { ExpandedLines, ProcessedLogLines } from "types/logs";
import { isCollapsedRow } from "utils/collapsedRow";
import { isExpanded } from "utils/expandedLines";

type FilterLogsParams = {
  logLines: string[];
  matchingLines: Set<number> | undefined;
  bookmarks: number[];
  shareLine: number | undefined;
  expandedLines: ExpandedLines;
  expandableRows: boolean;
};

/**
 * `filterLogs` processes log lines according to what filters, bookmarks, share line, and expanded lines are applied.
 * @param {string[]} obj.logLines - list of strings representing the log lines
 * @param {Set<number>} obj.matchingLines - set of numbers representing which lines match the applied filters
 * @param {number[]} obj.bookmarks - list of line numbers representing bookmarks
 * @param {number | undefined} obj.shareLine - a line number representing a share line
 * @param {ExpandedLines} obj.expandedLines - an array of intervals representing expanded ranges
 * @param {boolean} obj.expandableRows - specifies if expandable rows is enabled
 * @returns an array of numbers that indicates which log lines should be displayed, and which log lines
 * should be collapsed
 */
const filterLogs = ({
  logLines,
  matchingLines,
  bookmarks,
  shareLine,
  expandedLines,
  expandableRows,
}: FilterLogsParams): (number | number[])[] => {
  // If there are no filters or expandable rows is not enabled, then we don't have to do any
  // processing.
  if (matchingLines === undefined) {
    return logLines.map((_, idx) => idx);
  }

  const filteredLines: ProcessedLogLines = [];

  logLines.reduce((arr, _logLine, idx) => {
    // Bookmarks, expanded lines, and the share line should always remain uncollapsed.
    if (
      bookmarks.includes(idx) ||
      shareLine === idx ||
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

    if (expandableRows) {
      // If the line doesn't match the filters, collapse it.
      const previousItem = arr[arr.length - 1];
      if (isCollapsedRow(previousItem)) {
        previousItem.push(idx);
      } else {
        arr.push([idx]);
      }
    }
    return arr;
  }, filteredLines);

  return filteredLines;
};

export default filterLogs;
