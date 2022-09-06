import Row from "components/LogRow/Row";
import { RowProps } from "components/LogRow/RowRenderer";

const ResmokeRow: React.FC<RowProps> = (rowProps) => {
  const { data, listRowProps } = rowProps;
  const { getLine, wrap } = data;
  const { index } = listRowProps;
  return (
    <Row wrap={wrap} {...listRowProps}>
      <span data-cy="resmoke-row">{getLine(index)}</span>
    </Row>
  );
};

export { ResmokeRow };
