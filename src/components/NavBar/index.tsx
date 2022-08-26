import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import Icon from "components/Icon";
import PopoverButton from "components/PopoverButton";
import SearchBar from "components/SearchBar";
import { StyledLink, StyledRouterLink } from "components/styles";
import { size } from "constants/tokens";

const { gray, white } = palette;

const NavBar: React.FC = () => (
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
      <SearchBar />
    </FlexContainer>
    <ButtonContainer>
      <StyledButton buttonText="Filters">SomeContent</StyledButton>
      <StyledButton buttonText="Details">SomeContent</StyledButton>
    </ButtonContainer>
  </Container>
);

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
