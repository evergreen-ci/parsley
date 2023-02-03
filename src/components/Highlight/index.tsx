import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";

const { red, green, blue, yellow, purple } = palette;

const Highlight = styled.mark<{ "data-cy"?: string; color?: string }>`
  background-color: ${({ color }) => color};
  font-weight: bold;
`;

Highlight.defaultProps = {
  "data-cy": "highlight",
  color: red.light2,
};

const highlightColorList = [
  green.light1,
  blue.light2,
  red.light3,
  yellow.light2,
  green.light2,
  purple.light2,
  blue.base,
  green.light3,
  red.light2,
  yellow.light3,
];

export { highlightColorList };
export default Highlight;
