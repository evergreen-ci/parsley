import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";

const { blue, green, purple, red, yellow } = palette;

const Highlight = styled.mark<{ "data-cy"?: string; color?: string }>`
  background-color: ${({ color }) => color};
  font-weight: bold;
`;

Highlight.defaultProps = {
  color: red.light2,
  "data-cy": "highlight",
};

const highlightColorList = [
  green.light1,
  blue.light2,
  red.light3,
  yellow.light2,
  green.light2,
  purple.light2,
  blue.light1,
  green.light3,
  red.light2,
];

export { highlightColorList };
export default Highlight;
