import { WordWrapFormat } from "constants/enums";

/**
 * RootRowProps are the props that are passed to the root LogRow component.
 * These props are used to render any type of LogRow and should always be passed to the root LogRow component.
 */
interface RootRowProps {
  lineIndex: number;
}

interface LogRowProps extends RootRowProps {
  getLine: (index: number) => string | undefined;
  scrollToLine: (lineNumber: number) => void;

  highlightRegex?: RegExp;
  lineNumber: number;
  range: {
    lowerRange: number;
    upperRange?: number;
  };
  searchLine?: number;
  searchTerm?: RegExp;
  wordWrapFormat: WordWrapFormat;
  wrap: boolean;
}

export type { RootRowProps, LogRowProps };
