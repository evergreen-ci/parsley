import { forwardRef } from "react";
import CollapsedRow from "components/LogRow//CollapsedRow";
import BaseRow from "components/LogRow/BaseRow";
import { BaseRowProps } from "../types";

const AnsiiRow = forwardRef<any, BaseRowProps>((rowProps, ref) => {
  const { data, listRowProps } = rowProps;
  const { getLine, wrap, processedLines } = data;
  const { index } = listRowProps;

  const line = processedLines[index];

  return Array.isArray(line) ? (
    <CollapsedRow ref={ref} {...listRowProps} numCollapsed={line.length} />
  ) : (
    <BaseRow wrap={wrap} {...listRowProps} ref={ref} lineNumber={line}>
      <span data-cy="ansii-row">{getLine(line)}</span>
    </BaseRow>
  );
});

AnsiiRow.displayName = "AnsiiRow";

export { AnsiiRow };
