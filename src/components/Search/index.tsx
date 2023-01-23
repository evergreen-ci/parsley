import styled from "@emotion/styled";
import { useLogWindowAnalytics } from "analytics";
import SearchBar from "components/Search/SearchBar";
import SearchResults from "components/Search/SearchResults";
import { CaseSensitivity, MatchType, SearchBarActions } from "constants/enums";
import { size } from "constants/tokens";
import { useLogContext } from "context/LogContext";
import { useFilterParam } from "hooks/useFilterParam";
import { useHighlightParam } from "hooks/useHighlightParam";
import { validateRegexp } from "utils/validators";

const Search: React.FC = () => {
  const { sendEvent } = useLogWindowAnalytics();
  const { paginate, setSearch, hasLogs, searchState } = useLogContext();
  const { hasSearch } = searchState;

  const [filters, setFilters] = useFilterParam();
  const [highlights, setHighlights] = useHighlightParam();

  const handleSearch = (selected: string, value: string) => {
    switch (selected) {
      case SearchBarActions.Search:
        setSearch(value);
        break;
      case SearchBarActions.Filter:
        if (!filters.some((f) => f.name === value)) {
          setSearch("");
          setFilters([
            ...filters,
            {
              name: value,
              caseSensitive: CaseSensitivity.Insensitive,
              matchType: MatchType.Exact,
              visible: true,
            },
          ]);
          sendEvent({ name: "Added Filter", filterExpression: value });
        }
        break;
      case SearchBarActions.Highlight:
        if (!highlights.includes(value)) {
          setSearch("");
          setHighlights([...highlights, value]);
          sendEvent({ name: "Added Highlight", highlightExpression: value });
        }
        break;
      default:
        throw new Error("Invalid search action");
    }
  };

  const handleOnChange = (selected: string, value: string) => {
    if (selected === SearchBarActions.Search) {
      setSearch(value);
      sendEvent({ name: "Applied Search", searchExpression: value });
    }
  };

  return (
    <Container>
      <StyledSearchBar
        disabled={!hasLogs}
        onChange={handleOnChange}
        onSubmit={handleSearch}
        validator={validateRegexp}
        validatorMessage="Invalid Regular Expression"
      />
      {hasSearch && (
        <SearchResults paginate={paginate} searchState={searchState} />
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const StyledSearchBar = styled(SearchBar)`
  width: 60vw;
  margin-left: ${size.m};
`;

export default Search;
