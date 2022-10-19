import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import DetailsOverlay from "components/DetailsOverlay";
import Icon from "components/Icon";
import PopoverButton from "components/PopoverButton";
import SearchBar from "components/SearchBar";
import { StyledLink } from "components/styles";
import { SearchBarActions } from "constants/enums";
import { QueryParams } from "constants/queryParams";
import { navbarHeight, size } from "constants/tokens";
import { useLogContext } from "context/LogContext";
import { useQueryParam } from "hooks/useQueryParam";
import { validateRegexp } from "utils/validators";
import SearchResults from "./SearchResults";
import UploadLink from "./UploadLink";

const { gray, white } = palette;

const NavBar: React.FC = () => {
  const [filters, setFilters] = useQueryParam<string[]>(
    QueryParams.Filters,
    []
  );
  const { hasLogs, clearLogs, setSearch, searchState, paginate } =
    useLogContext();

  const { hasSearch } = searchState;
  const handleSearch = (selected: string, value: string) => {
    if (selected === SearchBarActions.Search) {
      setSearch(value);
    } else if (
      selected === SearchBarActions.Filter &&
      !filters.includes(value)
    ) {
      setFilters([...filters, value]);
      setSearch("");
    }
  };

  const handleOnChange = (selected: string, value: string) => {
    if (selected === SearchBarActions.Search) {
      setSearch(value);
    }
  };

  return (
    <Container>
      <FlexContainer>
        <Logo glyph="ParsleyLogo" size={24} useStroke />
        <LinkContainer>
          <StyledLink href="https://wiki.corp.mongodb.com">Wiki</StyledLink>
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
