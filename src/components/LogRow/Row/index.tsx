import styled from "@emotion/styled";

import { palette } from "@leafygreen-ui/palette";

const { gray } = palette;
const StyledPre = styled.pre`
  white-space: pre-wrap;
  :hover {
    background-color: ${gray.light1};
  }
`;

export default StyledPre;
