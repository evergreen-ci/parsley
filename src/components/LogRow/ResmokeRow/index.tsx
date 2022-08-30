import { ListRowProps, ListRowRenderer } from "react-virtualized";
import Row from "components/LogRow/Row";
import { useLogContext } from "context/LogContext";

const ResmokeRow: React.FC<ListRowProps> = (rowProps) => {
  const { getLine } = useLogContext();
  const { index } = rowProps;
  return <Row {...rowProps}>{getLine(index)}</Row>;
};

const ResmokeRowRenderer: ListRowRenderer = ({ ...props }) => (
  <ResmokeRow {...props} />
);

export { ResmokeRow };
export default ResmokeRowRenderer;
