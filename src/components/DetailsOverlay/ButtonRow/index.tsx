import Button from "@leafygreen-ui/button";
import Icon from "components/Icon";
import { DetailRow } from "../styles";

const ButtonRow: React.FC = () => (
  <DetailRow>
    <Button leftGlyph={<Icon glyph="Copy" />}>JIRA</Button>
    <Button leftGlyph={<Icon glyph="Export" />}>RAW</Button>
    <Button leftGlyph={<Icon glyph="Export" />}>HTML</Button>
  </DetailRow>
);

export default ButtonRow;
