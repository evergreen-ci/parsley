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
    wrap,
    range,
    searchTerm,
    highlightedLine,
    scrollToLine,
  } = data;

  const lineContent = getLine(lineNumber);
  const color = getResmokeLineColor(lineNumber);
  const inRange = isLineInRange(range, lineNumber);

  return lineContent ? (
    <BaseRow
      wrap={wrap}
      {...listRowProps}
      ref={ref}
      data-cy="resmoke-row"
      highlightedLine={highlightedLine}
      lineNumber={lineNumber}
      resmokeRowColor={color}
      scrollToLine={scrollToLine}
      searchTerm={inRange ? searchTerm : undefined}
    >
      {lineContent}
    </BaseRow>
  ) : null;
});

ResmokeRow.displayName = "ResmokeRow";

export default ResmokeRow;
