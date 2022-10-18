import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { size } from "constants/tokens";

const { gray, green } = palette;
interface LoadingBarProps {
  progress?: number;
  indeterminate: boolean;
}
const LoadingBar: React.FC<LoadingBarProps> = ({
  progress = 100,
  indeterminate = false,
}) => (
  <Container>
    <Bar progress={indeterminate ? 100 : progress} />
  </Container>
);

const Container = styled.div`
  height: 6px;
  background-color: ${gray.light2};
  border-radius: ${size.xxs};
  width: 100%;
`;

const Bar = styled.div<{ progress: number }>`
  width: ${({ progress }) => progress}%;
  height: 100%;
  /* border radius left */
  border-top-left-radius: ${size.xxs};
  border-bottom-left-radius: ${size.xxs};
  ${({ progress }) =>
    progress === 100 &&
    `
    /* border radius right */
    border-top-right-radius: ${size.xxs};
    border-bottom-right-radius: ${size.xxs};
    `}
  background: ${green.base};
  box-shadow: 0 0 ${size.xs} ${green.light2};
`;
export default LoadingBar;
