import { forwardRef, memo, useMemo } from "react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { ListRowProps } from "react-virtualized";
import Highlight from "components/Highlight";
import Icon from "components/Icon";
import { QueryParams } from "constants/queryParams";
import { fontSize, size } from "constants/tokens";
import { useQueryParam } from "hooks/useQueryParam";
import { formatPrettyPrint } from "utils/prettyPrint";
import renderHtml from "utils/renderHtml";
import { escapeHtml } from "utils/renderHtml/escapeHtml";

const { yellow, red } = palette;

interface BaseRowProps extends ListRowProps {
  children: string;
  "data-cy"?: string;
  index: number;
  // The line number associated with a log line and its index within the context of the virtualized list
  // may differ due to collapsed rows.
  lineNumber: number;
  prettyPrint: boolean;
  highlightedLine?: number;
  resetRowHeightAtIndex: (index: number) => void;
  scrollToLine: (lineNumber: number) => void;
  searchTerm?: RegExp;
  resmokeRowColor?: string;
  wrap: boolean;
}

/**
 * BaseRow is meant to be used as a wrapper for all rows in the log view.
 * It is responsible for handling the highlighting of the selected line
 */
const BaseRow = forwardRef<any, BaseRowProps>((props, ref) => {
  const {
    children,
    "data-cy": dataCyText,
    index,
    highlightedLine,
    lineNumber,
    prettyPrint,
    searchTerm,
    resmokeRowColor,
    wrap,
    resetRowHeightAtIndex,
    scrollToLine,
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
    resetRowHeightAtIndex(index);
    if (bookmarks.includes(lineNumber)) {
      const newBookmarks = bookmarks.filter((b) => b !== lineNumber);
      setBookmarks(newBookmarks);
    } else {
      const newBookmarks = [...bookmarks, lineNumber].sort((a, b) => a - b);
      setBookmarks(newBookmarks);
    }
  };

  return (
    <RowContainer
      ref={ref}
      {...rest}
      bookmarked={bookmarked}
      data-cy={`log-row-${lineNumber}`}
      data-highlighted={isHighlighted}
      data-selected={selected}
      highlighted={isHighlighted}
      onDoubleClick={handleDoubleClick}
      selected={selected}
    >
      <StyledIcon
        data-cy={`log-link-${lineNumber}`}
        glyph={selected ? "ArrowWithCircle" : "Link"}
        onClick={handleClick}
        size="small"
      />
      <Index>{lineNumber}</Index>
      <StyledPre shouldWrap={wrap}>
        <ProcessedBaseRow
          color={resmokeRowColor}
          data-cy={dataCyText}
          searchTerm={searchTerm}
        >
          {bookmarked && prettyPrint ? formatPrettyPrint(children) : children}
        </ProcessedBaseRow>
      </StyledPre>
    </RowContainer>
  );
});

interface ProcessedBaseRowProps {
  children: string;
  searchTerm?: RegExp;
  color?: string;
  ["data-cy"]?: string;
}

const ProcessedBaseRow: React.FC<ProcessedBaseRowProps> = memo((props) => {
  const { children, searchTerm, color, "data-cy": dataCy } = props;
  const memoizedLogLine = useMemo(() => {
    let render = children;
    if (searchTerm) {
      // escape the matching string to prevent XSS
      render = render.replace(
        searchTerm,
        (match) => `<mark>${escapeHtml(match)}</mark>`
      );
    }
    return renderHtml(render, {
      transform: {
        // @ts-expect-error - This is expecting a react component but its an Emotion component which are virtually the same thing
        mark: Highlight,
      },
    });
  }, [children, searchTerm]);

  return (
    <span data-cy={dataCy} style={{ color }}>
      {memoizedLogLine}
    </span>
  );
});

ProcessedBaseRow.displayName = "ProcessedBaseRow";
BaseRow.displayName = "BaseRow";

const RowContainer = styled.div<{
  selected: boolean;
  bookmarked: boolean;
  highlighted: boolean;
}>`
  display: flex;
  align-items: flex-start;

  ${({ color }) => color && `color: ${color};`}
  ${({ selected }) => selected && `background-color: ${yellow.light3};`}
  ${({ bookmarked }) => bookmarked && `background-color: ${yellow.light3};`}
  ${({ highlighted }) => highlighted && `background-color: ${red.light3};`}

  width: unset !important;
  // Hover should be an overlay shadow so that the user can see the color underneath.
  :hover {
    box-shadow: inset 0 0 0 999px rgba(0, 0, 0, 0.1);
  }

  font-family: "Source Code Pro", monospace;
  line-height: 1.25;
  font-size: ${fontSize.m};
`;

const StyledIcon = styled(Icon)`
  cursor: pointer;
  vertical-align: text-bottom;
  user-select: none;
  flex-shrink: 0;
`;

const Index = styled.pre`
  width: ${size.xl};
  margin-top: 0;
  margin-bottom: 0;
  margin-left: ${size.s};
  margin-right: ${size.s};
  user-select: none;
  flex-shrink: 0;
`;

const StyledPre = styled.pre<{
  shouldWrap: boolean;
}>`
  overflow-y: hidden;
  margin-top: 0;
  margin-bottom: 0;
  margin-right: ${size.xs};

  ${({ shouldWrap }) =>
    shouldWrap &&
    `
  /* wrap multiple lines */
  white-space: break-spaces;
  `}
`;

export default BaseRow;
