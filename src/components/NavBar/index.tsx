import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import Icon from "components/Icon";
import PopoverButton from "components/PopoverButton";
import SearchBar from "components/SearchBar";
import { StyledLink, StyledRouterLink } from "components/styles";
import { queryParams } from "constants/queryParams";
import { size } from "constants/tokens";
import { useQueryParam } from "hooks/useQueryParam";
import { validateRegexp } from "utils/validators";

const { gray, white } = palette;

const NavBar: React.FC = () => {
  const [, setSearch] = useQueryParam(queryParams.search, "");
  const [filters, setFilters] = useQueryParam<string[]>(
    queryParams.filters,
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
        <StyledButton buttonText="Details">SomeContent</StyledButton>
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
  height: ${size.xl};
  justify-content: space-between;
  padding: 0 ${size.s};
`;

const navLinkStyles = css`
  margin: 0 ${size.s};
`;

export default NavBar;
