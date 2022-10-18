import { forwardRef } from "react";
import BaseRow from "components/LogRow/BaseRow";
import { BaseRowProps } from "../types";
import { isLineInRange } from "../utils";

const ResmokeRow = forwardRef<any, BaseRowProps>((rowProps, ref) => {
  const { data, listRowProps } = rowProps;
  const {
    getLine,
    getResmokeLineColor,
    wrap,
    processedLines,
    range,
    searchTerm,
    highlightedLine,
    scrollToLine,
  } = data;
  const { index } = listRowProps;

  const line = processedLines[index] as number;
  const lineContent = getLine(line);
  const color = getResmokeLineColor(line);
  const inRange = isLineInRange(range, line);

  return lineContent ? (
    <BaseRow
      wrap={wrap}
      {...listRowProps}
      ref={ref}
      data-cy="resmoke-row"
      highlightedLine={highlightedLine}
      lineNumber={line}
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
