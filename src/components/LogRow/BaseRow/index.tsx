import { forwardRef } from "react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { ListRowProps } from "react-virtualized";
import Icon from "components/Icon";
import { QueryParams } from "constants/queryParams";
import { fontSize, size } from "constants/tokens";
import { useQueryParam } from "hooks/useQueryParam";

const { yellow, red } = palette;

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

  const [bookmarks, setBookmarks] = useQueryParam<number[]>(
    QueryParams.Bookmarks,
    []
  );
  const bookmarked = bookmarks.includes(index);

  // Clicking a line should select or deselect the line.
  const handleClick = () => {
    if (selected) {
      setSelectedLine(undefined);
    } else {
      setSelectedLine(index);
    }
  };

  // Double clicking a line should add or remove the line from bookmarks.
  const handleDoubleClick = () => {
    if (bookmarks.includes(index)) {
      const newBookmarks = bookmarks.filter((b) => b !== index);
      setBookmarks(newBookmarks);
    } else {
      const newBookmarks = [...bookmarks, index].sort();
      setBookmarks(newBookmarks);
    }
  };

  return (
    <StyledPre
      {...rest}
      ref={ref}
      bookmarked={bookmarked}
      data-cy={`log-row-${index}`}
      index={index}
      onDoubleClick={handleDoubleClick}
      selected={selected}
      shouldWrap={wrap}
    >
      <StyledIcon
        data-cy={`log-link-${index}`}
        glyph={selected ? "ArrowWithCircle" : "Link"}
        onClick={handleClick}
        size="small"
      />
      <Index>{index}</Index>
      {children}
    </StyledPre>
  );
});

BaseRow.displayName = "BaseRow";

const StyledIcon = styled(Icon)`
  cursor: pointer;
  vertical-align: text-bottom;
  user-select: none;
`;

const Index = styled.span`
  margin-left: ${size.s};
  margin-right: ${size.xl};
  user-select: none;
`;

const StyledPre = styled.pre<{
  index: number;
  shouldWrap: boolean;
  selected: boolean;
  bookmarked: boolean;
}>`
  overflow-y: hidden;
  margin-top: 0;
  margin-bottom: 0;
  margin-right: ${size.xs};
  font-size: ${fontSize.m};
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

  ${({ selected }) => selected && `background-color: ${red.light2};`}
  ${({ bookmarked }) => bookmarked && `background-color: ${yellow.light2};`}

  // Hover should be an overlay shadow so that the user can see the color underneath.
  :hover {
    box-shadow: inset 0 0 0 999px rgba(0, 0, 0, 0.1);
  }
`;

export default BaseRow;
