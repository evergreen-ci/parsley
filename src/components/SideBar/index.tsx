import { useEffect } from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { palette } from "@leafygreen-ui/palette";
import Tooltip from "@leafygreen-ui/tooltip";
import { useLogWindowAnalytics } from "analytics";
import Icon from "components/Icon";
import { QueryParams } from "constants/queryParams";
import { size } from "constants/tokens";
import { useQueryParam } from "hooks/useQueryParam";
import { findLineIndex } from "utils/findLineIndex";

const { gray, green } = palette;

interface SideBarProps {
  maxLineNumber: number;
  processedLogLines: (number | number[])[];
  scrollToLine: (scrollIndex: number) => void;
}

const SideBar: React.FC<SideBarProps> = ({
  maxLineNumber,
  processedLogLines,
  scrollToLine,
}) => {
  const [selectedLine] = useQueryParam<number | undefined>(
    QueryParams.SelectedLine,
    undefined
  );
  const [bookmarks, setBookmarks] = useQueryParam<number[]>(
    QueryParams.Bookmarks,
    []
  );
  const { sendEvent } = useLogWindowAnalytics();
  const lineNumbers = selectedLine
    ? Array.from(new Set([...bookmarks, selectedLine])).sort((a, b) => a - b)
    : bookmarks;

  // Set 0 and last log line to be initial bookmarks on load.
  useEffect(() => {
    if (bookmarks.length === 0) {
      setBookmarks([0, maxLineNumber]);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
      <LogLineContainer data-cy="sidebar-log-line-container">
        {lineNumbers.map((l) => (
          <LogLineNumber
            key={`sidebar-log-line-${l}`}
            data-cy={`sidebar-log-line-${l}`}
            onClick={() => {
              sendEvent({ name: "Navigated With Bookmark" });
              scrollToIndex(l);
            }}
          >
            <span>{l}</span>
            {l === selectedLine && <StyledIcon glyph="Link" size="small" />}
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
  z-index: 0;
`;

export default SideBar;
