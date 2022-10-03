import { forwardRef } from "react";
import BaseRow from "components/LogRow/BaseRow";
import { isExpanded } from "utils/expandedRanges";
import { BaseRowProps } from "../types";

const ResmokeRow = forwardRef<any, BaseRowProps>((rowProps, ref) => {
  const { data, listRowProps } = rowProps;
  const { getLine, wrap, processedLines, expandedLines } = data;
  const { index } = listRowProps;

  const line = processedLines[index] as number;
  const expanded = isExpanded(line, expandedLines);

  return (
    <BaseRow
      {...listRowProps}
      ref={ref}
      expanded={expanded}
      lineNumber={line}
      wrap={wrap}
    >
      <span data-cy="resmoke-row">{getLine(line)}</span>
    </BaseRow>
  );
});

ResmokeRow.displayName = "ResmokeRow";

export default ResmokeRow;
