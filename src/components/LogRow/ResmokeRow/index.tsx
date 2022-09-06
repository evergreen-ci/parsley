import { forwardRef } from "react";
import BaseRow from "components/LogRow/BaseRow";
import { RowProps } from "components/LogRow/RowRenderer";

const ResmokeRow = forwardRef<any, RowProps>((rowProps, ref) => {
  const { data, listRowProps } = rowProps;
  const { getLine, wrap } = data;
  const { index } = listRowProps;
  return (
    <BaseRow ref={ref} wrap={wrap} {...listRowProps}>
      <span data-cy="resmoke-row">{getLine(index)}</span>
    </BaseRow>
  );
});

ResmokeRow.displayName = "ResmokeRow";

export { ResmokeRow };
