import { useState } from "react";
import styled from "@emotion/styled";
import IconButton from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import DetailsOverlay from "components/DetailsOverlay";
import Icon from "components/Icon";
import PopoverButton from "components/PopoverButton";
import Search from "components/Search";
import ShortcutModal from "components/ShortcutModal";
import { StyledLink } from "components/styles";
import { navbarHeight, size } from "constants/tokens";
import { useLogContext } from "context/LogContext";
import UploadLink from "./UploadLink";

const { gray, white } = palette;

const NavBar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { hasLogs, clearLogs } = useLogContext();

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
        <Search />
      </FlexContainer>

      <FlexContainer>
        <IconButton
          aria-label="Click to open shortcut modal"
          onClick={() => setOpen(true)}
        >
          <Icon glyph="InfoWithCircle" />
        </IconButton>
        <StyledButton
          buttonText="Details"
          data-cy="details-button"
          disabled={!hasLogs}
        >
          <DetailsOverlay data-cy="details-overlay" />
        </StyledButton>
      </FlexContainer>

      <ShortcutModal open={open} setOpen={setOpen} />
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

const StyledButton = styled(PopoverButton)`
  margin: 0 ${size.xs};
`;

export default NavBar;
