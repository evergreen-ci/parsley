import { ProcessedLogLines } from "types/logs";

interface searchOptions {
  search: string;
  caseSensitive: boolean;
  upperBound?: number;
  lowerBound: number;
  getLine: (lineNumber: number) => string;
  processedLogLines: ProcessedLogLines;
}

export const searchLogs = (options: searchOptions): number[] => {
  const {
    search,
    caseSensitive,
    upperBound,
    lowerBound,
    getLine,
    processedLogLines,
  } = options;
  const matchingIndices = [];
  const searchRegex = new RegExp(search, caseSensitive ? "" : "i");

  for (let i = 0; i < processedLogLines.length; i++) {
    const lineIndex = processedLogLines[i];
    if (!Array.isArray(lineIndex)) {
      // Since processLogLines is ordered by line number, we can stop searching if we are out of range for our upper bound
      if (upperBound && lineIndex > upperBound) {
        break;
      }
      // If we are in range for our lower bound, we can start searching
      if (lineIndex >= lowerBound) {
        const line = getLine(lineIndex);
        if (searchRegex.test(line)) {
          matchingIndices.push(lineIndex);
        }
      }
    }
  }
  return matchingIndices;
};
