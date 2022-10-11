import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
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
  <StyledBody
    data-cy="search-count"
    has-matches={`${matchingSearchCount !== 0}`}
  >
    {matchingSearchCount !== 0
      ? `${currentSearchIndex}/${matchingSearchCount}`
      : "No Matches"}
  </StyledBody>
);

const StyledBody = styled(Body)<{ "has-matches": string }>`
  color: ${({ "has-matches": hasMatches }) => (hasMatches ? black : red.dark2)};
  margin-left: ${size.xs};
`;

export default SearchCount;
