import { memo, useCallback, useMemo } from "react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { useLogWindowAnalytics } from "analytics";
import Highlight, { highlightColorList } from "components/Highlight";
import Icon from "components/Icon";
import { QueryParams } from "constants/queryParams";
import { fontSize, size } from "constants/tokens";
import { useQueryParam } from "hooks/useQueryParam";
import { highlighter } from "utils/highlighters";
import { hasOverlappingRegex } from "utils/regex";
import renderHtml from "utils/renderHtml";
import { LogRowProps } from "../types";
import { isLineInRange } from "../utils";

const { yellow, red } = palette;

interface BaseRowProps extends Omit<LogRowProps, "getLine"> {
  children: string;
  "data-cy"?: string;
  color?: string;
}

/**
 * BaseRow is meant to be used as a wrapper for all rows in the log view.
 * It is responsible for handling the highlighting of the share line and bookmarks.
 * @param root0 - props passed to the component
 * @param root0.children - the text to be rendered
 * @param root0."data-cy" - data-cy attribute to be added to the row
 * @param root0.lineIndex - the index of the line in the log
 * @param root0.highlightRegex - the regex to be highlighted
 * @param root0.lineNumber - the line number of the line in the log
 * @param root0.searchLine - the line number of the line that was searched for
 * @param root0.searchTerm - the term that was searched for
 * @param root0.color - the color of the highlight
 * @param root0.wrap - whether or not the text should wrap
 * @param root0.scrollToLine - function to scroll to a line
 * @param root0.range - the range of lines to be displayed
 * @returns the base row component
 */
const BaseRow: React.FC<BaseRowProps> = ({
  children,
  "data-cy": dataCyText,
  lineIndex,
  highlightRegex,
  lineNumber,
  searchLine,
  searchTerm,
  color,
  wrap,
  scrollToLine,
  range,
  ...rest
}) => {
  const { sendEvent } = useLogWindowAnalytics();

  const [shareLine, setShareLine] = useQueryParam<number | undefined>(
    QueryParams.ShareLine,
    undefined
  );

  const [bookmarks, setBookmarks] = useQueryParam<number[]>(
    QueryParams.Bookmarks,
    []
  );
  const inRange = isLineInRange(range, lineNumber);

  const shared = shareLine === lineNumber;
  const bookmarked = bookmarks.includes(lineNumber);
  const highlighted = searchLine === lineIndex;

  // Clicking link icon should set or unset the share line.
  const handleClick = useCallback(() => {
    if (shared) {
      setShareLine(undefined);
    } else {
      setShareLine(lineNumber);
      scrollToLine(lineIndex);
    }
  }, [lineIndex, lineNumber, shared, scrollToLine, setShareLine]);

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
  }, [bookmarks, lineNumber, sendEvent, setBookmarks]);

  return (
    <RowContainer
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
          color={color}
          data-cy={dataCyText}
          highlights={highlightRegex}
          searchTerm={inRange ? searchTerm : undefined}
        >
          {children}
        </ProcessedBaseRow>
      </StyledPre>
    </RowContainer>
  );
};

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
  padding-left: 1px;

  ${({ shared }) => shared && `background-color: ${yellow.light3};`}
  ${({ bookmarked }) => bookmarked && `background-color: ${yellow.light3};`}
  ${({ highlighted }) => highlighted && `background-color: ${red.light3};`}
  width: fit-content;
  // Hover should be an overlay shadow so that the user can see the color underneath.
  :hover {
    box-shadow: inset 0 0 0 999px rgba(0, 0, 0, 0.1);
  }
`;

const StyledIcon = styled(Icon)`
  cursor: pointer;
  user-select: none;
  flex-shrink: 0;
  align-self: center;
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
  /* Remove overflow on pre */
  overflow: visible;
  font-family: inherit;
  line-height: inherit;
  font-size: inherit;
  ${({ shouldWrap }) =>
    shouldWrap && ` /* wrap multiple lines */ white-space: break-spaces;`}
`;

export default BaseRow;
