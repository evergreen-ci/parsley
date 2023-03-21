import BaseRow from "components/LogRow/BaseRow";
import { LogRowProps } from "../types";

interface ResmokeRowProps extends LogRowProps {
  prettyPrint: boolean;
  getResmokeLineColor: (lineNumber: number) => string | undefined;
}

const ResmokeRow: React.FC<ResmokeRowProps> = ({
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
}) => {
  const lineContent = getLine(lineNumber);
  const lineColor = getResmokeLineColor(lineNumber);

  return lineContent !== undefined ? (
    <BaseRow
      data-cy="resmoke-row"
      highlightRegex={highlightRegex}
      lineIndex={lineIndex}
      lineNumber={lineNumber}
      prettyPrint={prettyPrint}
      range={range}
      resmokeRowColor={lineColor}
      scrollToLine={scrollToLine}
      searchLine={searchLine}
      searchTerm={searchTerm}
      wrap={wrap}
    >
      {lineContent}
    </BaseRow>
  ) : null;
};

ResmokeRow.displayName = "ResmokeRow";

export default ResmokeRow;
