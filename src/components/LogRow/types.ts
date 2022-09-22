import { ListRowProps } from "react-virtualized";
import { LogTypes } from "constants/enums";

interface BaseRowProps {
  listRowProps: ListRowProps;
  data: RowData;
}

interface RowData {
  getLine: (index: number) => string | undefined;
  setScrollIndex: (scrollIndex: number | undefined) => void;
  wrap: boolean;
  processedLines: (number | number[])[];
  logType: LogTypes;
}

export type { BaseRowProps, RowData };
