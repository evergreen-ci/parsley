import { forwardRef } from "react";
import CollapsedRow from "components/LogRow//CollapsedRow";
import BaseRow from "components/LogRow/BaseRow";
import { BaseRowProps } from "../types";

const ResmokeRow = forwardRef<any, BaseRowProps>((rowProps, ref) => {
  const { data, listRowProps } = rowProps;
  const { getLine, setScrollIndex, wrap, processedLines } = data;
  const { index } = listRowProps;

  const line = processedLines[index];

  return Array.isArray(line) ? (
    <CollapsedRow ref={ref} {...listRowProps} numCollapsed={line.length} />
  ) : (
    <BaseRow
      ref={ref}
      {...listRowProps}
      lineNumber={line}
      setScrollIndex={setScrollIndex}
      wrap={wrap}
    >
      <span data-cy="resmoke-row">{getLine(line)}</span>
    </BaseRow>
  );
});

ResmokeRow.displayName = "ResmokeRow";

export default ResmokeRow;
