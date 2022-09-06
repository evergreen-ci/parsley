import { forwardRef } from "react";
import BaseRow from "components/LogRow/BaseRow";
import { RowProps } from "components/LogRow/RowRenderer";

const AnsiiRow = forwardRef<any, RowProps>((rowProps, ref) => {
  const { data, listRowProps } = rowProps;
  const { getLine, wrap, processedLines } = data;
  const { index } = listRowProps;

  const line = processedLines[index];
  const lineIndex = Array.isArray(line) ? line[0] : line;
  return (
    <BaseRow wrap={wrap} {...listRowProps} ref={ref}>
      <span data-cy="ansii-row">{getLine(lineIndex)}</span>
    </BaseRow>
  );
});

AnsiiRow.displayName = "AnsiiRow";

export { AnsiiRow };
