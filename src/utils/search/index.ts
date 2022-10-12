import { ProcessedLogLines } from "types/logs";
import { isCollapsedRow } from "utils/collapsedRow";

/**
 * `findLineIndex` employs binary search to search for the index of a line number within the
 * processed log lines array.
 * @param processedLines - processed log lines
 * @param lineNumber - line number to search for
 * @param start - the point in the array from which to start searching
 * @param end - the point in the array from which to stop searching
 * @returns the index of the line number within the array if it was found, otherwise -1
 */
export const findLineIndex = (
  processedLines: ProcessedLogLines,
  lineNumber: number | undefined,
  start: number = 0,
  end: number = processedLines.length - 1
): number => {
  // Line number was not found in the array.
  if (lineNumber === undefined || start > end) {
    return -1;
  }

  const midIdx = Math.floor((start + end) / 2);
  const midItem = processedLines[midIdx];

  // If the item is a collapsed row, we'll shift our search depending on the first and last line numbers
  // in the collapsed row.
  if (isCollapsedRow(midItem)) {
    const firstItem = midItem[0];
    const lastItem = midItem[midItem.length - 1];
    if (firstItem <= lineNumber && lineNumber <= lastItem) {
      return midIdx;
    }
    if (lineNumber < firstItem) {
      return findLineIndex(processedLines, lineNumber, start, midIdx - 1);
    }
    if (lineNumber > lastItem) {
      return findLineIndex(processedLines, lineNumber, midIdx + 1, end);
    }
  }
  // If item is not collapsed, we'll shift our search based on the line number.
  else {
    if (midItem === lineNumber) {
      return midIdx;
    }
    if (lineNumber < midItem) {
      return findLineIndex(processedLines, lineNumber, start, midIdx - 1);
    }
    if (lineNumber > midItem) {
      return findLineIndex(processedLines, lineNumber, midIdx + 1, end);
    }
  }

  return -1;
};
