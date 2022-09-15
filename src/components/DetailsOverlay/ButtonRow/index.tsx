import Button from "@leafygreen-ui/button";
import Icon from "components/Icon";
import { FilterRow } from "../styles";

const ButtonRow: React.FC = () => (
  <FilterRow>
    <Button leftGlyph={<Icon glyph="Copy" />}>JIRA</Button>
    <Button leftGlyph={<Icon glyph="Export" />}>RAW</Button>
    <Button leftGlyph={<Icon glyph="Export" />}>HTML</Button>
  </FilterRow>
);

export default ButtonRow;
