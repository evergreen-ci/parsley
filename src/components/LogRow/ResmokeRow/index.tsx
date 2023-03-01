import BaseRow from "components/LogRow/BaseRow";
import { LogRowProps } from "../types";
import { isLineInRange } from "../utils";

interface ResmokeRowProps extends LogRowProps {
  lineNumber: number;
  prettyPrint: boolean;
  getResmokeLineColor: (lineNumber: number) => string | undefined;
}

const ResmokeRow: React.FC<ResmokeRowProps> = (rowProps) => {
  const {
    getLine,
    scrollToLine,
    getResmokeLineColor,
    highlightRegex,
    lineNumber,
    lineIndex,
    searchLine,
    searchTerm,
    wrap,
    prettyPrint,
    range,
  } = rowProps;

  const lineContent = getLine(lineNumber);
  const lineColor = getResmokeLineColor(lineNumber);
  const inRange = isLineInRange(range, lineNumber);

  return lineContent !== undefined ? (
    <BaseRow
      data-cy="resmoke-row"
      highlights={highlightRegex}
      index={lineIndex}
      lineNumber={lineNumber}
      prettyPrint={prettyPrint}
      resmokeRowColor={lineColor}
      scrollToLine={scrollToLine}
      searchLine={searchLine}
      searchTerm={inRange ? searchTerm : undefined}
      wrap={wrap}
    >
      {lineContent}
    </BaseRow>
  ) : null;
};

ResmokeRow.displayName = "ResmokeRow";

export default ResmokeRow;
