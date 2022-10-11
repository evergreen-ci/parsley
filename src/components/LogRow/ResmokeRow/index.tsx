import { forwardRef } from "react";
import CollapsedRow from "components/LogRow//CollapsedRow";
import BaseRow from "components/LogRow/BaseRow";
import { isCollapsedRow } from "utils/collapsedRow";
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
    scrollToLine,
  } = data;
  const { index } = listRowProps;

  const line = processedLines[index];

  if (isCollapsedRow(line)) {
    return (
      <CollapsedRow ref={ref} {...listRowProps} numCollapsed={line.length} />
    );
  }
  const lineContent = getLine(line);
  const inRange = isLineInRange(range, line);

  return lineContent ? (
    <BaseRow
      wrap={wrap}
      {...listRowProps}
      ref={ref}
      data-cy-text="resmoke-row"
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
