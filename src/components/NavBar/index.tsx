import Styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { size } from "constants/tokens";

const { gray, white } = palette;

const NavBar: React.FC = () => <Container>OUR TRUSTY NAVBAR</Container>;

const Container = Styled.nav`
    align-items: center;
    background-color: ${white};
    border-bottom: 1px solid ${gray.light2};
    display: flex;
    height: ${size.xl};
    padding: 0 ${size.s};
`;

export default NavBar;
