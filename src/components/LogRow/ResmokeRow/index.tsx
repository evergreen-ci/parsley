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
    scrollToLine,
    highlightedLine,
    range,
    searchTerm,
    wrap,
  } = data;

  const lineContent = getLine(lineNumber);
  const lineColor = getResmokeLineColor(lineNumber);
  const inRange = isLineInRange(range, lineNumber);

  return lineContent ? (
    <BaseRow
      {...listRowProps}
      ref={ref}
      data-cy="resmoke-row"
      highlightedLine={highlightedLine}
      lineNumber={lineNumber}
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
