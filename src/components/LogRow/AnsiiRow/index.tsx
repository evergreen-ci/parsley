import { forwardRef } from "react";
import BaseRow from "components/LogRow/BaseRow";
import { RowProps } from "components/LogRow/RowRenderer";

const AnsiiRow = forwardRef<any, RowProps>((rowProps, ref) => {
  const { data, listRowProps } = rowProps;
  const { getLine, wrap } = data;
  const { index } = listRowProps;
  return (
    <BaseRow wrap={wrap} {...listRowProps} ref={ref}>
      <span data-cy="ansii-row">{getLine(index)}</span>
    </BaseRow>
  );
});

AnsiiRow.displayName = "AnsiiRow";

export { AnsiiRow };
