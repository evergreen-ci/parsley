import { useEffect } from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { palette } from "@leafygreen-ui/palette";
import Tooltip from "@leafygreen-ui/tooltip";
import { useLogWindowAnalytics } from "analytics";
import Icon from "components/Icon";
import { QueryParams } from "constants/queryParams";
import { size, zIndex } from "constants/tokens";
import { useQueryParam } from "hooks/useQueryParam";
import { ProcessedLogLines } from "types/logs";
import { findLineIndex } from "utils/findLineIndex";

const { gray, green } = palette;

interface BookmarksBarProps {
  lineCount: number;
  processedLogLines: ProcessedLogLines;
  scrollToLine: (scrollIndex: number) => void;
}

const BookmarksBar: React.FC<BookmarksBarProps> = ({
  lineCount,
  processedLogLines,
  scrollToLine,
}) => {
  const { sendEvent } = useLogWindowAnalytics();

  const [shareLine] = useQueryParam<number | undefined>(
    QueryParams.ShareLine,
    undefined
  );
  const [bookmarks, setBookmarks] = useQueryParam<number[]>(
    QueryParams.Bookmarks,
    []
  );

  // Set the initial bookmarks on load.
  useEffect(() => {
    if (bookmarks.length === 0 && lineCount !== 0) {
      if (lineCount === 1) {
        setBookmarks([0]);
      } else {
        setBookmarks([0, lineCount - 1]);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const lineNumbers =
    shareLine !== undefined
      ? Array.from(new Set([...bookmarks, shareLine])).sort((a, b) => a - b)
      : bookmarks;

  // Finds the corresponding index of a line number and scrolls to it.
  const scrollToIndex = (lineNumber: number): void => {
    const lineIndex = findLineIndex(processedLogLines, lineNumber);
    if (lineIndex !== -1) {
      scrollToLine(lineIndex);
    }
  };

  return (
    <Container>
      <Tooltip
        popoverZIndex={zIndex.tooltip}
        trigger={
          <StyledButton
            data-cy="clear-bookmarks"
            onClick={() => {
              setBookmarks([]);
              sendEvent({ name: "Cleared All Bookmarks" });
            }}
            size="xsmall"
          >
            Clear
          </StyledButton>
        }
      >
        Clear all bookmarks
      </Tooltip>
      <LogLineContainer data-cy="bookmark-list">
        {lineNumbers.map((l) => (
          <LogLineNumber
            key={`bookmark-${l}`}
            data-cy={`bookmark-${l}`}
            onClick={() => {
              sendEvent({ name: "Navigated With Bookmark" });
              scrollToIndex(l);
            }}
          >
            <span>{l}</span>
            {l === shareLine && <StyledIcon glyph="Link" size="small" />}
          </LogLineNumber>
        ))}
      </LogLineContainer>
    </Container>
  );
};

const StyledButton = styled(Button)`
  width: 52px;
`;

const LogLineContainer = styled.div`
  margin-left: ${size.xs};
  margin-top: ${size.xxs};
  align-self: start;
  cursor: pointer;
  overflow-y: scroll;
`;

const LogLineNumber = styled.div`
  display: flex;
  align-items: center;
  font-size: 13px;
  line-height: 1.5em;
  font-family: "Source Code Pro";
  :hover {
    color: ${green.dark1};
  }
`;

const StyledIcon = styled(Icon)`
  vertical-align: text-bottom;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: ${size.xl};
  background-color: ${gray.light3};
  box-shadow: 0 ${size.xxs} ${size.xxs} rgba(0, 0, 0, 0.25);
  padding-top: ${size.s};
`;

export default BookmarksBar;
