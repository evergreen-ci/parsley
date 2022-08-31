import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { ListRowProps } from "react-virtualized";
import { size } from "constants/tokens";

const { gray } = palette;

/** Make index unselectable so copying a line doesn't copy it */
const Index = styled.span`
  user-select: none;
`;

interface RowProps extends ListRowProps {
  children: React.ReactNode;
  index: number;
  wrap: boolean;
}
const Row: React.FC<RowProps> = (props) => {
  const { index, children, ...rest } = props;
  return (
    <StyledPre {...rest}>
      <Index>
        {index} {"\t"}
      </Index>

      {children}
    </StyledPre>
  );
};

Row.displayName = "Row";

const StyledPre = styled.pre<{ wrap: boolean }>`
  padding-left: ${size.m};
  overflow-y: hidden;

  ${(props) =>
    props.wrap &&
    `
  /* wrap multiple lines */
  word-break: break-all;
  word-wrap: break-word;
  white-space: pre-wrap;
  `}

  :hover {
    background-color: ${gray.light1};
  }
`;

export default Row;
