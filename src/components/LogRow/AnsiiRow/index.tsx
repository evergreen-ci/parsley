import { ListRowRenderer } from "react-virtualized";

const AnsiiRow: ListRowRenderer = ({ index, key, style }) => (
  <div key={key} style={style}>
    {index}
  </div>
);

export default AnsiiRow;
