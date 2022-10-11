import { forwardRef } from "react";
import BaseRow from "components/LogRow/BaseRow";
import { isExpanded } from "utils/expandedRanges";
import { BaseRowProps } from "../types";
import { isLineInRange } from "../utils";

const ResmokeRow = forwardRef<any, BaseRowProps>((rowProps, ref) => {
  const { data, listRowProps } = rowProps;
  const {
    getLine,
    wrap,
    processedLines,
    range,
    searchTerm,
    highlightedLine,
    expandedLines,
    scrollToLine,
  } = data;
  const { index } = listRowProps;

  const line = processedLines[index] as number;
  const expanded = isExpanded(line, expandedLines);

  const lineContent = getLine(line);
  const inRange = isLineInRange(range, line);

  return lineContent ? (
    <BaseRow
      wrap={wrap}
      {...listRowProps}
      ref={ref}
      data-cy-text="resmoke-row"
      expanded={expanded}
      highlightedLine={highlightedLine}
      lineNumber={line}
      scrollToLine={scrollToLine}
      searchTerm={inRange ? searchTerm : undefined}
    >
      {lineContent}
    </BaseRow>
  ) : null;
});

ResmokeRow.displayName = "ResmokeRow";

export default ResmokeRow;
