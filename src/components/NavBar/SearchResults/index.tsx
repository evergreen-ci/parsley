import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { DIRECTION, SearchState } from "context/LogContext/types";
import SearchCount from "./SearchCount";

interface SearchResultsProps {
  searchState: SearchState;
  paginate: (dir: DIRECTION) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  searchState,
  paginate,
}) => (
  <SearchContainer>
    <SearchCount
      currentSearchIndex={(searchState.searchIndex ?? 0) + 1}
      matchingSearchCount={searchState.searchRange ?? 0}
    />

    {searchState.searchRange !== undefined && (
      <>
        <Button
          data-cy="previous-button"
          onClick={() => paginate(DIRECTION.PREVIOUS)}
          size="small"
        >
          Prev
        </Button>
        <Button
          data-cy="next-button"
          onClick={() => paginate(DIRECTION.NEXT)}
          size="small"
        >
          Next
        </Button>
      </>
    )}
  </SearchContainer>
);

const SearchContainer = styled.div`
  align-items: center;
  display: flex;
`;

export default SearchResults;
