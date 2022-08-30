import styled from "@emotion/styled";
import Button, { Size } from "@leafygreen-ui/button";
import { palette } from "@leafygreen-ui/palette";
import { navbarHeight, size } from "constants/tokens";

const { gray } = palette;

/** TODO: EVG-17532 */
const SideBar = () => (
  <Container>
    <StyledButton size={Size.XSmall}>Clear</StyledButton>
    <span>1</span>
  </Container>
);

const StyledButton = styled(Button)`
  width: 55px;
`;
const Container = styled.div`
  background-color: ${gray.light3};
  width: ${size.xl};
  max-height: calc(100vh - ${navbarHeight});
  box-shadow: 0 4px 4px rgb(0 0 0 / 25%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: ${size.s};
`;

export default SideBar;
