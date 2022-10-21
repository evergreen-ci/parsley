import { ListRowProps } from "react-virtualized";
import { ExpandedLines } from "types/logs";

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
  range: {
    lowerRange: number;
    upperRange?: number;
  };
  searchTerm?: RegExp;
  wrap: boolean;
}

export type { BaseRowProps, RowData };
