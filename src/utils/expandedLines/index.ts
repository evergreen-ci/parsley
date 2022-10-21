import { ExpandedLines } from "types/logs";

/**
 * Given an array of intervals, this function will merge any consecutive intervals.
 * @param intervals - a list of intervals taking the form [start, end]
 * @returns an array of merged intervals
 */
export const mergeIntervals = (intervals: ExpandedLines) => {
  // If there is 1 or less intervals, there is nothing to be merged.
  if (intervals.length <= 1) {
    return intervals;
  }

  // Sort the intervals by the start number.
  intervals.sort((a, b) => a[0] - b[0]);

  const mergedIntervals = [];
  let current = intervals[0];

  for (let i = 1; i < intervals.length; i++) {
    // If current interval's END + 1 equals next interval's START, the intervals can be merged.
    if (current[1] + 1 === intervals[i][0]) {
      current = [current[0], intervals[i][1]];
    } else {
      mergedIntervals.push(current);
      current = intervals[i];
    }
  }
  mergedIntervals.push(current);

  return mergedIntervals;
};

/**
 * Function that determines if a particular line is an expanded line.
 * @param lineNumber - the line number of the log line
 * @param expandedLines - an array of intervals representing expanded ranges
 * @returns true if the line is expanded, false otherwise
 */
export const isExpanded = (
  lineNumber: number,
  expandedLines: ExpandedLines
) => {
  let expanded = false;

  for (let i = 0; i < expandedLines.length; i++) {
    const start = expandedLines[i][0];
    const end = expandedLines[i][1];
    if (lineNumber >= start && lineNumber <= end) {
      expanded = true;
      break;
    }
  }
  return expanded;
};
