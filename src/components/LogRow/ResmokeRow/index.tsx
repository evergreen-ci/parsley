import { ListRowRenderer } from "react-virtualized";
import Pre from "components/LogRow/Row";

const ResmokeRow: ListRowRenderer = ({ index, key, style }) => (
  <Pre key={key} style={style}>
    ResmokeRow: {index}
  </Pre>
);

export default ResmokeRow;
