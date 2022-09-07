import { forwardRef } from "react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { ListRowProps } from "react-virtualized";
import { QueryParams } from "constants/queryParams";
import { fontSize, size } from "constants/tokens";
import { useQueryParam } from "hooks/useQueryParam";

const { gray, yellow } = palette;

interface BaseRowProps extends ListRowProps {
  children: React.ReactNode;
  index: number;
  wrap: boolean;
}
/**
 * BaseRow is meant to be used as a wrapper for all rows in the log view.
 * It is responsible for handling the highlighting of the selected line
 */
const BaseRow = forwardRef<any, BaseRowProps>((props, ref) => {
  const { index, children, wrap, isVisible, ...rest } = props;
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
      ref={ref}
      data-cy={`log-row-${index}`}
      index={index}
      onDoubleClick={handleDoubleClick}
      selected={selected}
      shouldWrap={wrap}
    >
      {children}
    </StyledPre>
  );
});

BaseRow.displayName = "BaseRow";

const StyledPre = styled.pre<{
  index: number;
  shouldWrap: boolean;
  selected: boolean;
}>`
  overflow-y: hidden;
  /* margin-top: 0;
  margin-bottom: 0; */
  /* margin-left: ${size.xs}; */
  margin-right: ${size.xs};
  font-size: ${fontSize.m};
  :before {
    content: "${(props) => props.index}";
    margin-left: ${size.s};
    margin-right: ${size.xl};
  }
  /* Override react-virtualized default width to allow horizontal scroll */
  width: unset !important;

  ${({ shouldWrap }) =>
    shouldWrap &&
    `
  /* wrap multiple lines */
  white-space: break-spaces;
  `}

  ${({ selected }) => selected && `background-color: ${yellow.light3};`}
  :hover {
    background-color: ${gray.light1};
  }
`;

export default BaseRow;
