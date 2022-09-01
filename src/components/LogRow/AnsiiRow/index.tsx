import {
  CellMeasurer,
  CellMeasurerCache,
  ListRowProps,
  ListRowRenderer,
} from "react-virtualized";
import Row from "components/LogRow/Row";
import { useLogContext } from "context/LogContext";
import { useQueryParam } from "hooks/useQueryParam";

const AnsiiRow: React.FC<ListRowProps> = (rowProps) => {
  const { getLine } = useLogContext();
  const { index } = rowProps;
  const [wrap] = useQueryParam("wrap", false);
  return (
    <Row wrap={wrap} {...rowProps}>
      <span data-cy="ansii-row">{getLine(index)}</span>
    </Row>
  );
};

const AnsiiRowRenderer: ListRowRenderer = (props) => {
  const { index, key, parent } = props;
  return (
    <CellMeasurer key={key} cache={cache} parent={parent} rowIndex={index}>
      <AnsiiRow {...props} />
    </CellMeasurer>
  );
};

const cache = new CellMeasurerCache({
  fixedWidth: true,
  defaultHeight: 16,
});

export { AnsiiRow, cache };
export default AnsiiRowRenderer;
