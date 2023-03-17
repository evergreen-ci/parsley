import { forwardRef, memo, useCallback, useMemo } from "react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { ListRowProps } from "react-virtualized";
import { useLogWindowAnalytics } from "analytics";
import Highlight, { highlightColorList } from "components/Highlight";
import Icon from "components/Icon";
import { QueryParams } from "constants/queryParams";
import { fontSize, size } from "constants/tokens";
import { useQueryParam } from "hooks/useQueryParam";
import { highlighter } from "utils/highlighters";
import { formatPrettyPrint } from "utils/prettyPrint";
import { hasOverlappingRegex } from "utils/regex";
import renderHtml from "utils/renderHtml";

const { yellow, red } = palette;

interface BaseRowProps extends ListRowProps {
  children: string;
  "data-cy"?: string;
  index: number;
  // The line number associated with a log line and its index within the context of the virtualized list
  // may differ due to collapsed rows.
  lineNumber: number;
  prettyPrint?: boolean;
  searchLine?: number;
  resetRowHeightAtIndex: (index: number) => void;
  scrollToLine: (lineNumber: number) => void;
  searchTerm?: RegExp;
  highlights?: RegExp;
  resmokeRowColor?: string;
  wrap: boolean;
}

/**
 * BaseRow is meant to be used as a wrapper for all rows in the log view.
 * It is responsible for handling the highlighting of the share line and bookmarks.
 */
const BaseRow = forwardRef<any, BaseRowProps>((props, ref) => {
  const {
    children,
    "data-cy": dataCyText,
    index,
    highlights,
    lineNumber,
    prettyPrint = false,
    searchLine,
    searchTerm,
    resmokeRowColor,
    wrap,
    resetRowHeightAtIndex,
    scrollToLine,
    ...rest
  } = props;

  const { sendEvent } = useLogWindowAnalytics();

  const [shareLine, setShareLine] = useQueryParam<number | undefined>(
    QueryParams.ShareLine,
    undefined
  );

  const [bookmarks, setBookmarks] = useQueryParam<number[]>(
    QueryParams.Bookmarks,
    []
  );

  const shared = shareLine === lineNumber;
  const bookmarked = bookmarks.includes(lineNumber);
  const highlighted = searchLine === index;

  // Clicking link icon should set or unset the share line.
  const handleClick = useCallback(() => {
    if (shared) {
      setShareLine(undefined);
    } else {
      setShareLine(lineNumber);
      scrollToLine(index);
    }
  }, [index, lineNumber, shared, scrollToLine, setShareLine]);

  // Double clicking a line should add or remove the line from bookmarks.
  const handleDoubleClick = useCallback(() => {
    if (bookmarks.includes(lineNumber)) {
      const newBookmarks = bookmarks.filter((b) => b !== lineNumber);
      setBookmarks(newBookmarks);
      sendEvent({ name: "Removed Bookmark" });
    } else {
      const newBookmarks = [...bookmarks, lineNumber].sort((a, b) => a - b);
      setBookmarks(newBookmarks);
      sendEvent({ name: "Added Bookmark" });
    }

    if (prettyPrint) {
      resetRowHeightAtIndex(index);
    }
  }, [
    bookmarks,
    index,
    lineNumber,
    prettyPrint,
    resetRowHeightAtIndex,
    sendEvent,
    setBookmarks,
  ]);

  return (
    <RowContainer
      ref={ref}
      {...rest}
      bookmarked={bookmarked}
      data-bookmarked={bookmarked}
      data-cy={`log-row-${lineNumber}`}
      data-highlighted={highlighted}
      data-shared={shared}
      highlighted={highlighted}
      onDoubleClick={handleDoubleClick}
      shared={shared}
    >
      <StyledIcon
        data-cy={`log-link-${lineNumber}`}
        glyph={shared ? "ArrowWithCircle" : "Link"}
        onClick={handleClick}
        size="small"
      />
      <Index lineNumber={lineNumber} />
      <StyledPre shouldWrap={wrap}>
        <ProcessedBaseRow
          color={resmokeRowColor}
          data-cy={dataCyText}
          highlights={highlights}
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
  highlights?: RegExp;
  ["data-cy"]?: string;
}

const ProcessedBaseRow: React.FC<ProcessedBaseRowProps> = memo((props) => {
  const { children, searchTerm, color, "data-cy": dataCy, highlights } = props;
  const memoizedLogLine = useMemo(() => {
    let render = children;
    if (searchTerm) {
      // escape the matching string to prevent XSS
      render = highlighter(
        new RegExp(searchTerm, searchTerm.ignoreCase ? "gi" : "g"),
        render,
        (match) => `<mark>${match}</mark>`
      );
    }
    if (highlights) {
      const shouldCheckForOverlappingRegex = searchTerm !== undefined;
      const hasOverlappingRegexes =
        shouldCheckForOverlappingRegex &&
        hasOverlappingRegex(searchTerm, highlights, children);
      if (!hasOverlappingRegexes) {
        render = highlighter(
          new RegExp(highlights, highlights.ignoreCase ? "gi" : "g"),
          render,
          (match, index) =>
            `<mark color="${
              highlightColorList[index % highlightColorList.length]
            }">${match}</mark>`
        );
      }
    }
    return renderHtml(render, {
      preserveAttributes: ["mark"],
      transform: {
        // @ts-expect-error - This is expecting a react component but its an Emotion component which are virtually the same thing
        mark: Highlight,
      },
    });
  }, [children, searchTerm, highlights]);

  return (
    <span data-cy={dataCy} style={{ color }}>
      {memoizedLogLine}
    </span>
  );
});

ProcessedBaseRow.displayName = "ProcessedBaseRow";
BaseRow.displayName = "BaseRow";

const RowContainer = styled.div<{
  shared: boolean;
  bookmarked: boolean;
  highlighted: boolean;
}>`
  display: flex;
  align-items: flex-start;

  font-family: "Source Code Pro", monospace;
  line-height: 1.25;
  font-size: ${fontSize.m};

  ${({ color }) => color && `color: ${color};`}
  ${({ shared }) => shared && `background-color: ${yellow.light3};`}
  ${({ bookmarked }) => bookmarked && `background-color: ${yellow.light3};`}
  ${({ highlighted }) => highlighted && `background-color: ${red.light3};`}

  width: unset !important;
  // Hover should be an overlay shadow so that the user can see the color underneath.
  :hover {
    box-shadow: inset 0 0 0 999px rgba(0, 0, 0, 0.1);
  }
`;

const StyledIcon = styled(Icon)`
  cursor: pointer;
  user-select: none;
  flex-shrink: 0;
`;

const Index = styled.pre<{ lineNumber: number }>`
  width: ${size.xl};
  margin-top: 0;
  margin-bottom: 0;
  margin-left: ${size.s};
  margin-right: ${size.s};
  flex-shrink: 0;

  font-family: inherit;
  line-height: inherit;
  font-size: inherit;
  user-select: none;

  ::before {
    ${({ lineNumber }) => `content: "${lineNumber}";`}
  }
`;

const StyledPre = styled.pre<{
  shouldWrap: boolean;
}>`
  overflow-y: hidden;
  margin-top: 0;
  margin-bottom: 0;
  margin-right: ${size.xs};

  font-family: inherit;
  line-height: inherit;
  font-size: inherit;
  ${({ shouldWrap }) =>
    shouldWrap && ` /* wrap multiple lines */ white-space: break-spaces;`}
`;

export default BaseRow;
