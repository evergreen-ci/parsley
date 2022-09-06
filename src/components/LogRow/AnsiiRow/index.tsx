import { forwardRef } from "react";
import Row from "components/LogRow/Row";
import { RowProps } from "components/LogRow/RowRenderer";

const AnsiiRow = forwardRef<any, RowProps>((rowProps, ref) => {
  const { data, listRowProps } = rowProps;
  const { getLine, wrap } = data;
  const { index } = listRowProps;
  return (
    <Row wrap={wrap} {...listRowProps} ref={ref}>
      <span data-cy="ansii-row">{getLine(index)}</span>
    </Row>
  );
});

AnsiiRow.displayName = "AnsiiRow";

export { AnsiiRow };
