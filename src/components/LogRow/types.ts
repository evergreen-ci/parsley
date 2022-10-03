import { ListRowProps } from "react-virtualized";
import { LogTypes } from "constants/enums";
import { ExpandedLines } from "types/logs";

interface BaseRowProps {
  listRowProps: ListRowProps;
  data: RowData;
}

interface RowData {
  getLine: (index: number) => string | undefined;
  wrap: boolean;
  processedLines: (number | number[])[];
  logType: LogTypes;
  setExpandedLines: (expandedLines: ExpandedLines) => void;
  expandedLines: ExpandedLines;
}

export type { BaseRowProps, RowData };
