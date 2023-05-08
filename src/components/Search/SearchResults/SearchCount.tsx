import styled, { StyledComponent } from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { Body, BodyProps } from "@leafygreen-ui/typography";
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
` as StyledComponent<BodyProps>;

export default SearchCount;
