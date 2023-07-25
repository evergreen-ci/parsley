import { useCallback } from "react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { useLogWindowAnalytics } from "analytics";
import Icon from "components/Icon";
import { QueryParams } from "constants/queryParams";
import { fontSize, size } from "constants/tokens";
import { useQueryParam } from "hooks/useQueryParam";
import Highlighter from "./Highlighter";
import { LogRowProps } from "../types";
import { isLineInRange } from "../utils";

const { yellow, red } = palette;

interface BaseRowProps extends Omit<LogRowProps, "getLine"> {
  children: string;
  "data-cy"?: string;
  color?: string;
}

/**
 * `BaseRow` is meant to be used as a wrapper for all rows in the log view.
 * It is responsible for handling any highlights for the row, as well as rendering line counts and bookmarks.
 * @param BaseRowProps - props to be passed to the BaseRow component
 * @param BaseRowProps.children - the text to be rendered
 * @param BaseRowProps."data-cy" - data-cy attribute to be added to the row
 * @param BaseRowProps.lineIndex - the index of the line in the log
 * @param BaseRowProps.highlightRegex - the regex to be highlighted
 * @param BaseRowProps.lineNumber - the line number of the line in the log
 * @param BaseRowProps.searchLine - the line number of the line that was searched for
 * @param BaseRowProps.searchTerm - the term that was searched for
 * @param BaseRowProps.color - the color of the highlight
 * @param BaseRowProps.wrap - whether or not the text should wrap
 * @param BaseRowProps.scrollToLine - function to scroll to a line
 * @param BaseRowProps.range - the range of lines to be displayed
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
      <ShareIcon
        data-cy={`log-link-${lineNumber}`}
        glyph={shared ? "ArrowWithCircle" : "Link"}
        onClick={handleClick}
        size="small"
      />
      <Index lineNumber={lineNumber} />
      <StyledPre shouldWrap={wrap}>
        <Highlighter
          color={color}
          data-cy={dataCyText}
          highlights={highlightRegex}
          searchTerm={inRange ? searchTerm : undefined}
        >
          {children}
        </Highlighter>
      </StyledPre>
    </RowContainer>
  );
};

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

const ShareIcon = styled(Icon)`
  cursor: pointer;
  user-select: none;
  flex-shrink: 0;
  margin-left: ${size.xxs};
  margin-top: 2px;
`;

const Index = styled.pre<{ lineNumber: number }>`
  width: ${size.xl};
  margin-top: 0;
  margin-bottom: 0;
  margin-left: ${size.xs};
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
