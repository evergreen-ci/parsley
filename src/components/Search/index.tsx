import { useRef } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { useLogWindowAnalytics } from "analytics";
import SearchBar from "components/Search/SearchBar";
import SearchBarGuideCue from "components/Search/SearchBarGuideCue";
import SearchResults from "components/Search/SearchResults";
import { CaseSensitivity, MatchType, SearchBarActions } from "constants/enums";
import { size } from "constants/tokens";
import { useLogContext } from "context/LogContext";
import {
  ProjectFiltersQuery,
  ProjectFiltersQueryVariables,
} from "gql/generated/types";
import { PROJECT_FILTERS } from "gql/queries";
import { useFilterParam } from "hooks/useFilterParam";
import { useHighlightParam } from "hooks/useHighlightParam";
import { useTaskQuery } from "hooks/useTaskQuery";
import { leaveBreadcrumb } from "utils/errorReporting";
import { validateRegexp } from "utils/validators";

const Search: React.FC = () => {
  const { sendEvent } = useLogWindowAnalytics();

  const containerRef = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useFilterParam();
  const [highlights, setHighlights] = useHighlightParam();
  const { hasLogs, logMetadata, paginate, searchState, setSearch } =
    useLogContext();
  const { buildID, execution, logType, taskID } = logMetadata ?? {};
  const { hasSearch } = searchState;

  const { task } = useTaskQuery({ buildID, execution, logType, taskID });
  const { versionMetadata } = task ?? {};
  const { projectIdentifier = "" } = versionMetadata ?? {};

  const { data } = useQuery<ProjectFiltersQuery, ProjectFiltersQueryVariables>(
    PROJECT_FILTERS,
    {
      skip: !projectIdentifier,
      variables: { projectIdentifier },
    }
  );
  const { project } = data || {};
  const { parsleyFilters } = project || {};

  const handleOnSubmit = (selected: string, value: string) => {
    switch (selected) {
      case SearchBarActions.Filter:
        if (!filters.some((f) => f.name === value)) {
          setSearch("");
          setFilters([
            ...filters,
            {
              caseSensitive: CaseSensitivity.Insensitive,
              matchType: MatchType.Exact,
              name: value,
              visible: true,
            },
          ]);
          sendEvent({ filterExpression: value, name: "Added Filter" });
          leaveBreadcrumb("Added Filter", { filterExpression: value });
        }
        break;
      case SearchBarActions.Highlight:
        if (!highlights.includes(value)) {
          setSearch("");
          setHighlights([...highlights, value]);
          sendEvent({ highlightExpression: value, name: "Added Highlight" });
          leaveBreadcrumb("Added Highlight", { highlightExpression: value });
        }
        break;
      default:
        throw new Error("Invalid search action");
    }
  };

  const handleOnChange = (value: string) => {
    setSearch(value);
    sendEvent({ name: "Applied Search", searchExpression: value });
    leaveBreadcrumb("Applied Search", { searchExpression: value });
  };

  return (
    <Container ref={containerRef}>
      {hasLogs && containerRef.current && (
        <SearchBarGuideCue containerRef={containerRef.current} />
      )}
      <StyledSearchBar
        disabled={!hasLogs}
        onChange={handleOnChange}
        onSubmit={handleOnSubmit}
        paginate={paginate}
        searchSuggestions={parsleyFilters?.map((p) => p.expression)}
        validator={validateRegexp}
        validatorMessage="Invalid regular expression"
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
