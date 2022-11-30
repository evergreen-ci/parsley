import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { useLogWindowAnalytics } from "analytics";
import DetailsOverlay from "components/DetailsOverlay";
import Icon from "components/Icon";
import PopoverButton from "components/PopoverButton";
import SearchBar from "components/SearchBar";
import { StyledLink } from "components/styles";
import { CaseSensitivity, MatchType, SearchBarActions } from "constants/enums";
import { QueryParams } from "constants/queryParams";
import { navbarHeight, size } from "constants/tokens";
import { useLogContext } from "context/LogContext";
import { useFilterParam } from "hooks/useFilterParam";
import { useQueryParam } from "hooks/useQueryParam";
import { validateRegexp } from "utils/validators";
import SearchResults from "./SearchResults";
import UploadLink from "./UploadLink";

const { gray, white } = palette;

const NavBar: React.FC = () => {
  const [filters, setFilters] = useFilterParam();
  const [highlights, setHighlights] = useQueryParam<string[]>(
    QueryParams.Highlights,
    []
  );
  const { hasLogs, clearLogs, setSearch, searchState, paginate } =
    useLogContext();
  const { sendEvent } = useLogWindowAnalytics();
  const { hasSearch } = searchState;
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
      <FlexContainer>
        <Logo glyph="ParsleyLogo" size={24} useStroke />
        <LinkContainer>
          <StyledLink href="https://github.com/evergreen-ci/parsley/wiki">
            Wiki
          </StyledLink>
          <UploadLink clearLogs={clearLogs} hasLogs={hasLogs} />
        </LinkContainer>
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
      </FlexContainer>

      <StyledButton
        buttonText="Details"
        data-cy="details-button"
        disabled={!hasLogs}
      >
        <DetailsOverlay data-cy="details-overlay" />
      </StyledButton>
    </Container>
  );
};

const Container = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;

  height: ${navbarHeight};
  background-color: ${white};
  border-bottom: 1px solid ${gray.light2};
  padding: 0 ${size.s};
`;

const Logo = styled(Icon)`
  margin-right: ${size.m};
`;

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
`;

const LinkContainer = styled.div`
  display: flex;
  margin-right: ${size.l};
  gap: ${size.l};
`;

const StyledSearchBar = styled(SearchBar)`
  width: 60vw;
  margin-left: ${size.m};
`;

const StyledButton = styled(PopoverButton)`
  margin: 0 ${size.xs};
`;

export default NavBar;
