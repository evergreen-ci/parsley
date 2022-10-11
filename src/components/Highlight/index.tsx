import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";

const { red } = palette;

const Highlight = styled.mark<{ "data-cy"?: string }>`
  background-color: ${red.light2};
`;

Highlight.defaultProps = {
  "data-cy": "highlight",
};

export default Highlight;
