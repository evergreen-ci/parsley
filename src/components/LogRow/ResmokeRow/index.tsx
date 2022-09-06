import { forwardRef } from "react";
import Row from "components/LogRow/Row";
import { RowProps } from "components/LogRow/RowRenderer";

const ResmokeRow = forwardRef<any, RowProps>((rowProps, ref) => {
  const { data, listRowProps } = rowProps;
  const { getLine, wrap } = data;
  const { index } = listRowProps;
  return (
    <Row ref={ref} wrap={wrap} {...listRowProps}>
      <span data-cy="resmoke-row">{getLine(index)}</span>
    </Row>
  );
});

ResmokeRow.displayName = "ResmokeRow";

export { ResmokeRow };
