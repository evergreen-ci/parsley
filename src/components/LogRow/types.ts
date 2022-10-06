import { ListRowProps } from "react-virtualized";
import { LogTypes } from "constants/enums";
import { ProcessedLogLines } from "types/logs";

interface BaseRowProps {
  listRowProps: ListRowProps;
  data: RowData;
}

interface RowData {
  getLine: (index: number) => string | undefined;
  wrap: boolean;
  processedLines: ProcessedLogLines;
  logType: LogTypes;
  searchTerm?: RegExp;
  range: {
    lowerRange: number;
    upperRange?: number;
  };
  highlightedLine?: number;
}

export type { BaseRowProps, RowData };
