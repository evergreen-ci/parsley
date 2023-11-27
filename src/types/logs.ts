import { CaseSensitivity, MatchType } from "constants/enums";
import { CommandEntry } from "hooks/useSections";

type ExpandedLine = [number, number];
type ExpandedLines = ExpandedLine[];

type LineType = "section";
interface ProcessedLogLine {
  line: number | number[];
  type?: LineType;
  commands?: CommandEntry[];
}
type ProcessedLogLines = ProcessedLogLine[];

type Filter = {
  expression: string;
  visible: boolean;
  caseSensitive: CaseSensitivity;
  matchType: MatchType;
};
type Filters = Filter[];

type SelectedLineRange = {
  startingLine?: number;
  endingLine?: number;
};

export type {
  ExpandedLine,
  ExpandedLines,
  Filter,
  Filters,
  ProcessedLogLine,
  ProcessedLogLines,
  SelectedLineRange,
};
