import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { size } from "constants/tokens";

const { red, black } = palette;
interface SearchCountProps {
  matchingSearchCount: number;
  currentSearchIndex?: number;
}
const SearchCount: React.FC<SearchCountProps> = ({
  currentSearchIndex,
  matchingSearchCount,
}) => (
  <Container hasMatches={matchingSearchCount !== 0}>
    {matchingSearchCount !== 0
      ? `${currentSearchIndex}/${matchingSearchCount}`
      : "Not Found"}
  </Container>
);

const Container = styled.div<{ hasMatches: boolean }>`
  align-items: center;
  color: ${({ hasMatches }) => (hasMatches ? black : red.dark2)};
  display: flex;
  justify-content: center;
  margin-left: ${size.xs};
`;

export default SearchCount;
