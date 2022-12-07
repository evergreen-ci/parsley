import { forwardRef } from "react";
import BaseRow from "components/LogRow/BaseRow";
import { BaseRowProps } from "../types";
import { isLineInRange } from "../utils";

interface ResmokeRowProps extends BaseRowProps {
  lineNumber: number;
}

const ResmokeRow = forwardRef<any, ResmokeRowProps>((rowProps, ref) => {
  const { data, listRowProps, lineNumber } = rowProps;
  const {
    getLine,
    getResmokeLineColor,
    resetRowHeightAtIndex,
    scrollToLine,
    highlightedLine,
    prettyPrint,
    range,
    searchTerm,
    wrap,
    highlights,
  } = data;

  const lineContent = getLine(lineNumber);
  const lineColor = getResmokeLineColor(lineNumber);
  const inRange = isLineInRange(range, lineNumber);

  return lineContent !== undefined ? (
    <BaseRow
      {...listRowProps}
      ref={ref}
      data-cy="resmoke-row"
      highlightedLine={highlightedLine}
      highlights={highlights}
      lineNumber={lineNumber}
      prettyPrint={prettyPrint}
      resetRowHeightAtIndex={resetRowHeightAtIndex}
      resmokeRowColor={lineColor}
      scrollToLine={scrollToLine}
      searchTerm={inRange ? searchTerm : undefined}
      wrap={wrap}
    >
      {lineContent}
    </BaseRow>
  ) : null;
});

ResmokeRow.displayName = "ResmokeRow";

export default ResmokeRow;
