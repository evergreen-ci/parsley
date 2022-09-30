import { useEffect } from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { palette } from "@leafygreen-ui/palette";
import Icon from "components/Icon";
import { QueryParams } from "constants/queryParams";
import { navbarHeight, size } from "constants/tokens";
import { useQueryParam } from "hooks/useQueryParam";
import { findLineIndex } from "utils/search";

const { gray } = palette;

interface SideBarProps {
  maxLineNumber: number;
  processedLogLines: (number | number[])[];
  setScrollIndex: (scrollIndex: number | undefined) => void;
}

const SideBar: React.FC<SideBarProps> = ({
  maxLineNumber,
  processedLogLines,
  setScrollIndex,
}) => {
  const [selectedLine] = useQueryParam<number | undefined>(
    QueryParams.SelectedLine,
    undefined
  );
  const [bookmarks, setBookmarks] = useQueryParam<number[]>(
    QueryParams.Bookmarks,
    []
  );

  // Set 0 and last log line to be initial bookmarks on load.
  useEffect(() => {
    if (bookmarks.length === 0) {
      setBookmarks([0, maxLineNumber]);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const lineNumbers = selectedLine
    ? Array.from(new Set([...bookmarks, selectedLine])).sort((a, b) => a - b)
    : bookmarks;

  // Finds the corresponding index of a line number and scrolls to it.
  const scrollToIndex = (lineNumber: number): void => {
    const lineIndex = findLineIndex(processedLogLines, lineNumber);
    setScrollIndex(lineIndex);
  };

  return (
    <Container>
      <StyledButton
        data-cy="clear-bookmarks"
        onClick={() => setBookmarks([])}
        size="xsmall"
      >
        Clear
      </StyledButton>
      <LogLineContainer data-cy="log-line-container">
        {lineNumbers.map((l) => (
          <LogLineNumber
            key={`log-line-${l}`}
            data-cy={`log-line-${l}`}
            onClick={() => scrollToIndex(l)}
          >
            <span> {l} </span>
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
  margin-left: ${size.xxs};
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
`;

const StyledIcon = styled(Icon)`
  vertical-align: text-bottom;
`;

const Container = styled.div`
  background-color: ${gray.light3};
  width: ${size.xl};
  max-height: calc(100vh - ${navbarHeight});
  box-shadow: 0 ${size.xxs} ${size.xxs} rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: ${size.s};
  z-index: 1;
`;

export default SideBar;
