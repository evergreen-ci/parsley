import { ProcessedLogLines, SelectedLineRange } from "types/logs";
import { isCollapsedRow } from "utils/collapsedRow";
import { findLineIndex } from "utils/findLineIndex";

const getLinesInProcessedLogLinesFromSelectedLines = (
  processedLogLines: ProcessedLogLines,
  selectedLines: SelectedLineRange
) => {
  const startingIndex = findLineIndex(
    processedLogLines,
    selectedLines.startingLine
  );
  const endingIndex = findLineIndex(
    processedLogLines,
    selectedLines.endingLine
  );

  if (startingIndex === -1 || endingIndex === -1) return [];
  const lines: number[] = [];
  for (let i = startingIndex; i <= endingIndex; i++) {
    const line = processedLogLines[i];
    if (!isCollapsedRow(line)) {
      lines.push(line);
    }
  }
  return lines;
};

export { getLinesInProcessedLogLinesFromSelectedLines };
