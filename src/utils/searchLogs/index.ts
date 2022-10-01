import { ProcessedLogLines } from "types/logs";

interface searchOptions {
  searchRegex: RegExp;
  upperBound?: number;
  lowerBound: number;
  getLine: (lineNumber: number) => string;
  processedLogLines: ProcessedLogLines;
}

const searchLogs = (options: searchOptions): number[] => {
  const { searchRegex, upperBound, lowerBound, getLine, processedLogLines } =
    options;
  const matchingIndices = [];
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

export default searchLogs;
