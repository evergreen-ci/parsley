import { ListRowProps, ListRowRenderer } from "react-virtualized";
import Row from "components/LogRow/Row";
import { useLogContext } from "context/LogContext";

const AnsiiRow: React.FC<ListRowProps> = (rowProps) => {
  const { getLine } = useLogContext();
  const { index } = rowProps;
  return <Row {...rowProps}>{getLine(index)}</Row>;
};

const AnsiiRowRenderer: ListRowRenderer = ({ ...props }) => (
  <AnsiiRow {...props} index={0} />
);

export { AnsiiRow };
export default AnsiiRowRenderer;
