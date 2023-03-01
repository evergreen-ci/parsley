interface BaseRowProps {
  lineIndex: number;
}

interface LogRowProps extends BaseRowProps {
  getLine: (index: number) => string | undefined;
  scrollToLine: (lineNumber: number) => void;

  highlightRegex?: RegExp;
  range: {
    lowerRange: number;
    upperRange?: number;
  };
  searchLine?: number;
  searchTerm?: RegExp;
  wrap: boolean;
}

export type { BaseRowProps, LogRowProps };
