import { ListRowProps } from "react-virtualized";

interface BaseRowProps {
  listRowProps: ListRowProps;
}

interface LogRowProps extends BaseRowProps {
  getLine: (index: number) => string | undefined;
  resetRowHeightAtIndex: (index: number) => void;
  scrollToLine: (lineNumber: number) => void;

  highlightRegex?: RegExp;
  highlights?: RegExp;
  range: {
    lowerRange: number;
    upperRange?: number;
  };
  searchLine?: number;
  searchTerm?: RegExp;
  wrap: boolean;
}

export type { BaseRowProps, LogRowProps };
