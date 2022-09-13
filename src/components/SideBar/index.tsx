import { useEffect } from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { palette } from "@leafygreen-ui/palette";
import Icon from "components/Icon";
import { QueryParams } from "constants/queryParams";
import { fontSize, navbarHeight, size } from "constants/tokens";
import { useQueryParam } from "hooks/useQueryParam";

const { gray } = palette;

interface SideBarProps {
  maxLineNumber: number;
}

/** TODO: EVG-17532 */
const SideBar: React.FC<SideBarProps> = ({ maxLineNumber }) => {
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
          <LogLineNumber key={`log-line-${l}`}>
            <span> {l} </span>
            {l === selectedLine && <StyledIcon glyph="Link" size="small" />}
          </LogLineNumber>
        ))}
      </LogLineContainer>
    </Container>
  );
};

const StyledButton = styled(Button)`
  width: 56px;
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
  font-size: ${fontSize.m};
`;

const StyledIcon = styled(Icon)`
  vertical-align: text-bottom;
  margin-left: ${size.xxs};
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
