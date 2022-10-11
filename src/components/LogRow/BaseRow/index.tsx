import { forwardRef, useMemo } from "react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { ListRowProps } from "react-virtualized";
import Highlight from "components/Highlight";
import Icon from "components/Icon";
import { QueryParams } from "constants/queryParams";
import { fontSize, size } from "constants/tokens";
import { useQueryParam } from "hooks/useQueryParam";
import renderHtml from "utils/renderHtml";

const { yellow, red } = palette;

interface BaseRowProps extends ListRowProps {
  children: string;
  index: number;
  wrap: boolean;
  // The line number associated with a log line and its index within the context of the virtualized list
  // may differ due to collapsed rows.
  lineNumber: number;
  highlightedLine?: number;
  scrollToLine: (lineNumber: number) => void;
  searchTerm?: RegExp;
  "data-cy-text"?: string;
}

/**
 * BaseRow is meant to be used as a wrapper for all rows in the log view.
 * It is responsible for handling the highlighting of the selected line
 */
const BaseRow = forwardRef<any, BaseRowProps>((props, ref) => {
  const {
    index,
    lineNumber,
    children,
    wrap,
    isVisible,
    highlightedLine,
    scrollToLine,
    searchTerm,
    "data-cy-text": dataCyText,
    ...rest
  } = props;

  const [selectedLine, setSelectedLine] = useQueryParam<number | undefined>(
    QueryParams.SelectedLine,
    undefined
  );
  const selected = selectedLine === lineNumber;
  const isHighlighted = highlightedLine === index;

  const [bookmarks, setBookmarks] = useQueryParam<number[]>(
    QueryParams.Bookmarks,
    []
  );
  const bookmarked = bookmarks.includes(lineNumber);

  // Clicking a line should select or deselect the line.
  const handleClick = () => {
    if (selected) {
      setSelectedLine(undefined);
    } else {
      setSelectedLine(lineNumber);
      scrollToLine(index);
    }
  };

  // Double clicking a line should add or remove the line from bookmarks.
  const handleDoubleClick = () => {
    if (bookmarks.includes(lineNumber)) {
      const newBookmarks = bookmarks.filter((b) => b !== lineNumber);
      setBookmarks(newBookmarks);
    } else {
      const newBookmarks = [...bookmarks, lineNumber].sort((a, b) => a - b);
      setBookmarks(newBookmarks);
    }
  };

  return (
    <StyledPre
      {...rest}
      ref={ref}
      bookmarked={bookmarked}
      data-cy={`log-row-${lineNumber}`}
      data-highlighted={isHighlighted}
      data-selected={selected}
      highlighted={isHighlighted}
      onDoubleClick={handleDoubleClick}
      selected={selected}
      shouldWrap={wrap}
    >
      <StyledIcon
        data-cy={`log-link-${lineNumber}`}
        glyph={selected ? "ArrowWithCircle" : "Link"}
        onClick={handleClick}
        size="small"
      />
      <Index>{lineNumber}</Index>
      <ProcessedBaseRow data-cy={dataCyText} searchTerm={searchTerm}>
        {children}
      </ProcessedBaseRow>
    </StyledPre>
  );
});

interface ProcessedBaseRowProps {
  children: string;
  searchTerm?: RegExp;
  ["data-cy"]?: string;
}
const ProcessedBaseRow: React.FC<ProcessedBaseRowProps> = ({
  children,
  searchTerm,
  "data-cy": dataCy,
}) => {
  const memoizedLogLine = useMemo(() => {
    let render = children;
    if (searchTerm) {
      render = render.replace(searchTerm, `<mark>$&</mark>`);
    }
    return renderHtml(render, {
      transform: {
        // @ts-expect-error - This is expecting a react component but its an Emotion component which are virtually the same thing
        mark: Highlight,
      },
    });
  }, [children, searchTerm]);

  return <span data-cy={dataCy}>{memoizedLogLine}</span>;
};

BaseRow.displayName = "BaseRow";

const StyledIcon = styled(Icon)`
  cursor: pointer;
  vertical-align: text-bottom;
  user-select: none;
`;

const Index = styled.span`
  display: inline-block;
  width: ${size.xl};
  margin-left: ${size.s};
  margin-right: ${size.s};
  user-select: none;
`;

const StyledPre = styled.pre<{
  shouldWrap: boolean;
  selected: boolean;
  bookmarked: boolean;
  highlighted: boolean;
}>`
  overflow-y: hidden;
  margin-top: 0;
  margin-bottom: 0;
  margin-right: ${size.xs};
  font-size: ${fontSize.m};
  width: unset !important;
  ${({ shouldWrap }) =>
    shouldWrap &&
    `
  /* wrap multiple lines */
  white-space: break-spaces;
  `}

  ${({ selected }) => selected && `background-color: #FA8128;`}
  ${({ bookmarked }) => bookmarked && `background-color: ${yellow.light2};`}
  ${({ highlighted }) => highlighted && `background-color: ${red.light2};`}
  ${({ highlighted }) =>
    highlighted &&
    `
    mark {
      filter: brightness(0.7);
    }
`}
  // Hover should be an overlay shadow so that the user can see the color underneath.
  :hover {
    box-shadow: inset 0 0 0 999px rgba(0, 0, 0, 0.1);
  }
`;

export default BaseRow;
