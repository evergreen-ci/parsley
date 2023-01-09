import { forwardRef } from "react";
import BaseRow from "components/LogRow/BaseRow";
import { LogRowProps } from "../types";
import { isLineInRange } from "../utils";

interface ResmokeRowProps extends LogRowProps {
  lineNumber: number;
  prettyPrint: boolean;
  getResmokeLineColor: (lineNumber: number) => string | undefined;
}

const ResmokeRow = forwardRef<any, ResmokeRowProps>((rowProps, ref) => {
  const {
    getLine,
    resetRowHeightAtIndex,
    scrollToLine,
    getResmokeLineColor,
    highlightRegex,
    lineNumber,
    listRowProps,
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
      {...listRowProps}
      ref={ref}
      data-cy="resmoke-row"
      highlights={highlightRegex}
      lineNumber={lineNumber}
      prettyPrint={prettyPrint}
      resetRowHeightAtIndex={resetRowHeightAtIndex}
      resmokeRowColor={lineColor}
      scrollToLine={scrollToLine}
      searchLine={searchLine}
      searchTerm={inRange ? searchTerm : undefined}
      wrap={wrap}
    >
      {lineContent}
    </BaseRow>
  ) : null;
});

ResmokeRow.displayName = "ResmokeRow";

export default ResmokeRow;
