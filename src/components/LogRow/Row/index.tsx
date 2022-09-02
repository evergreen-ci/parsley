import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { ListRowProps } from "react-virtualized";
import { QueryParams } from "constants/queryParams";
import { size } from "constants/tokens";
import { useQueryParam } from "hooks/useQueryParam";

const { gray, yellow } = palette;

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
      data-cy={`log-row-${index}`}
      index={index}
      onDoubleClick={handleDoubleClick}
      selected={selected}
      shouldWrap={wrap}
    >
      {children}
    </StyledPre>
  );
};

Row.displayName = "Row";

const StyledPre = styled.pre<{
  index: number;
  shouldWrap: boolean;
  selected: boolean;
}>`
  overflow-y: hidden;
  :before {
    content: "${(props) => props.index} \t";
    padding-left: ${size.s};
  }
  ${({ shouldWrap }) =>
    shouldWrap
      ? `
  /* wrap multiple lines */
  white-space: break-spaces;
  `
      : `
      /* override react-virtualized's width */
      width: unset !important;
  `}
  ${({ selected }) => selected && `background-color: ${yellow.light3};`}
  :hover {
    background-color: ${gray.light1};
  }
`;

export default Row;
