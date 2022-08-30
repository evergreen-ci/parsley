import styled from "@emotion/styled";
import Button, { Size } from "@leafygreen-ui/button";
import { palette } from "@leafygreen-ui/palette";
import { navbarHeight, size } from "constants/tokens";

const { gray } = palette;

const SideBar = () => (
  <Container>
    <Button size={Size.XSmall}>Clear</Button>1
  </Container>
);

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
