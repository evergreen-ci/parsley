import { useState } from "react";
import styled from "@emotion/styled";
import { useLogWindowAnalytics } from "analytics";
import SearchBar from "components/Search/SearchBar";
import SearchBarGuideCue from "components/Search/SearchBarGuideCue";
import SearchResults from "components/Search/SearchResults";
import { CaseSensitivity, MatchType, SearchBarActions } from "constants/enums";
import { size } from "constants/tokens";
import { useLogContext } from "context/LogContext";
import { useFilterParam } from "hooks/useFilterParam";
import { useHighlightParam } from "hooks/useHighlightParam";
import { validateRegexp } from "utils/validators";

const Search: React.FC = () => {
  const [filters, setFilters] = useFilterParam();
  const [highlights, setHighlights] = useHighlightParam();

  const { sendEvent } = useLogWindowAnalytics();
  const { hasLogs, setSearch, searchState, paginate } = useLogContext();
  const { hasSearch } = searchState;

  const handleOnSubmit = (selected: string, value: string) => {
    switch (selected) {
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

  const handleOnChange = (value: string) => {
    setSearch(value);
    sendEvent({ name: "Applied Search", searchExpression: value });
  };

  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

  return (
    <Container ref={(el) => setContainerRef(el)}>
      {hasLogs && containerRef && (
        <SearchBarGuideCue containerRef={containerRef} />
      )}
      <StyledSearchBar
        disabled={!hasLogs}
        onChange={handleOnChange}
        onSubmit={handleOnSubmit}
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
