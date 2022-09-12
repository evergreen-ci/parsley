import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import DetailsOverlay from "components/DetailsOverlay";
import Icon from "components/Icon";
import PopoverButton from "components/PopoverButton";
import SearchBar from "components/SearchBar";
import { StyledLink, StyledRouterLink } from "components/styles";
import { QueryParams } from "constants/queryParams";
import { navbarHeight, size } from "constants/tokens";
import { useQueryParam } from "hooks/useQueryParam";
import { validateRegexp } from "utils/validators";

const { gray, white } = palette;

const NavBar: React.FC = () => {
  const [, setSearch] = useQueryParam(QueryParams.Search, "");
  const [filters, setFilters] = useQueryParam<string[]>(
    QueryParams.Filters,
    []
  );

  const handleSearch = (selected: string, value: string) => {
    if (selected === "search") {
      setSearch(value);
    } else if (selected === "filter") {
      setFilters([...filters, value]);
    }
  };

  return (
    <Container>
      <FlexContainer>
        <LinkContainer>
          <Icon glyph="LobsterLogo" />
          <StyledLink css={navLinkStyles} href="https://wiki.corp.mongodb.com">
            Wiki
          </StyledLink>
          <StyledRouterLink css={navLinkStyles} to="/upload">
            Upload
          </StyledRouterLink>
        </LinkContainer>
        <StyledSearchBar
          onSubmit={handleSearch}
          validator={validateRegexp}
          validatorMessage="Invalid Regular Expression"
        />
      </FlexContainer>
      <ButtonContainer>
        <StyledButton buttonText="Filters">SomeContent</StyledButton>
        <StyledButton buttonText="Details" data-cy="details-button">
          <DetailsOverlay />
        </StyledButton>
      </ButtonContainer>
    </Container>
  );
};

const FlexContainer = styled.div`
  display: flex;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 ${size.xs};
  justify-self: flex-end;
`;

const StyledSearchBar = styled(SearchBar)`
  width: 60vw;
`;

const StyledButton = styled(PopoverButton)`
  margin: 0 ${size.xs};
`;

const LinkContainer = styled.div`
  display: flex;
  margin-right: ${size.l};
`;

const Container = styled.nav`
  align-items: center;
  background-color: ${white};
  border-bottom: 1px solid ${gray.light2};
  display: flex;
  height: ${navbarHeight};
  justify-content: space-between;
  padding: 0 ${size.s};
  position: static;
`;

const navLinkStyles = css`
  margin: 0 ${size.s};
`;

export default NavBar;
