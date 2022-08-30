import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { ListRowProps } from "react-virtualized";
import { size } from "constants/tokens";

const { gray } = palette;
const StyledPre = styled.pre`
  padding-left: ${size.m};
  white-space: normal;
  overflow-y: hidden;
  :hover {
    background-color: ${gray.light1};
  }
`;
interface RowProps extends ListRowProps {
  children: React.ReactNode;
  index: number;
}
const Row: React.FC<RowProps> = ({ index, children, ...rest }) => (
  <StyledPre {...rest}>
    {index}
    {"\t"}
    {children}
  </StyledPre>
);

export default Row;
