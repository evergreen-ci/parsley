import {
  CellMeasurer,
  CellMeasurerCache,
  ListRowProps,
  ListRowRenderer,
} from "react-virtualized";
import Row from "components/LogRow/Row";
import { useLogContext } from "context/LogContext";

const ResmokeRow: React.FC<ListRowProps> = (rowProps) => {
  const { getLine } = useLogContext();
  const { index } = rowProps;
  const wrap = true;
  return (
    <Row wrap={wrap} {...rowProps}>
      {getLine(index)}
    </Row>
  );
};

const ResmokeRowRenderer: ListRowRenderer = (props) => {
  const { index, key, parent } = props;
  return (
    <CellMeasurer key={key} cache={cache} parent={parent} rowIndex={index}>
      <ResmokeRow {...props} />
    </CellMeasurer>
  );
};

const cache = new CellMeasurerCache({
  fixedWidth: true,
  defaultHeight: 16,
});

export { ResmokeRow, cache };
export default ResmokeRowRenderer;
