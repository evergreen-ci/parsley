import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import Icon from "components/Icon";
import { StyledLink } from "components/styles";
import { size, subheaderHeight } from "constants/tokens";

const { gray } = palette;

/** TODO: EVG-17534 */
const SubHeader = () => (
  <Container>
    <StyledIcon glyph="EvergreenLogo" />
    <StyledLink href="/test">Task Page</StyledLink>
  </Container>
);

const StyledIcon = styled(Icon)`
  padding-left: ${size.l};
  padding-right: ${size.l};
`;

const Container = styled.div`
  background-color: ${gray.light3};
  width: calc(100vw - 55px);
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.05);
  height: ${subheaderHeight};
  display: flex;
  align-items: center;
`;

export default SubHeader;
