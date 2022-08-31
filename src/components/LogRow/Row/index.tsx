import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { ListRowProps } from "react-virtualized";
import { QueryParams } from "constants/queryParams";
import { size } from "constants/tokens";
import { useQueryParam } from "hooks/useQueryParam";

const { gray, yellow } = palette;

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
  const { index, children, wrap, ...rest } = props;
  const [selectedLine, setSelectedLine] = useQueryParam<number | undefined>(
    QueryParams.SelectedLine,
    undefined
  );
  const selected = selectedLine === index;
  const handleDoubleClick = () => {
    if (selected) {
      setSelectedLine(undefined);
    } else {
      setSelectedLine(index);
    }
  };
  return (
    <StyledPre
      {...rest}
      onDoubleClick={handleDoubleClick}
      selected={selected}
      wrap={`${wrap}`}
    >
      <Index>
        {index}
        {"\t"}
      </Index>

      {children}
    </StyledPre>
  );
};

Row.displayName = "Row";

const StyledPre = styled.pre<{ wrap: string; selected: boolean }>`
  padding-left: ${size.m};
  overflow-y: hidden;

  ${({ wrap }) =>
    wrap &&
    `
  /* wrap multiple lines */
  word-break: break-all;
  word-wrap: break-word;
  white-space: pre-wrap;
  `}

  ${({ selected }) => selected && `background-color: ${yellow.light3};`}
  :hover {
    background-color: ${gray.light1};
  }
`;

export default Row;
