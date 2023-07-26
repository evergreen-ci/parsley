import { ProcessedLogLines } from "types/logs";
import { isCollapsedRow } from "utils/collapsedRow";

interface searchOptions {
  searchRegex: RegExp;
  upperBound?: number;
  lowerBound: number;
  getLine: (lineNumber: number) => string;
  processedLogLines: ProcessedLogLines;
}

const searchLogs = (options: searchOptions): number[] => {
  const { getLine, lowerBound, processedLogLines, searchRegex, upperBound } =
    options;
  const matchingIndices: number[] = [];
  for (let i = 0; i < processedLogLines.length; i++) {
    const lineIndex = processedLogLines[i];
    if (!isCollapsedRow(lineIndex)) {
      // Since processLogLines is ordered by line number, we can stop searching if we are out of range for our upper bound
      if (upperBound && lineIndex > upperBound) {
        break;
      }
      // If we are in range for our lower bound, we can start searching
      if (lineIndex >= lowerBound) {
        const line = getLine(lineIndex);
        if (searchRegex.test(line)) {
          // We want to match the index of the processedLogLines array, not the line number
          matchingIndices.push(i);
        }
      }
    }
  }
  return matchingIndices;
};

export default searchLogs;
