import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Body } from "@leafygreen-ui/typography";
import Icon from "components/Icon";
import { size } from "constants/tokens";

interface FileSelectorProps {
  open: () => void;
}

const FileSelector: React.FC<FileSelectorProps> = ({ open }) => (
  <FileSelectorContainer>
    <Body weight="medium">Drag and Drop a log file to view in Parsley</Body>
    <Body weight="medium">or</Body>
    <Button
      leftGlyph={<Icon glyph="Upload" />}
      onClick={(e) => {
        e.stopPropagation();
        open();
      }}
    >
      Select from files
    </Button>
  </FileSelectorContainer>
);

const FileSelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${size.xs};
`;

export default FileSelector;
