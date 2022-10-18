import { ListRowProps } from "react-virtualized";
import { LogTypes } from "constants/enums";
import { ExpandedLines, ProcessedLogLines } from "types/logs";

interface BaseRowProps {
  listRowProps: ListRowProps;
  data: RowData;
}

interface RowData {
  expandLines: (expandedLines: ExpandedLines) => void;
  getLine: (index: number) => string | undefined;
  getResmokeLineColor: (index: number) => string | undefined;
  scrollToLine: (lineNumber: number) => void;

  highlightedLine?: number;
  logType: LogTypes;
  processedLines: ProcessedLogLines;
  range: {
    lowerRange: number;
    upperRange?: number;
  };
  searchTerm?: RegExp;
  wrap: boolean;
}

export type { BaseRowProps, RowData };
