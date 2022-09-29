import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { size } from "constants/tokens";

const { red, gray } = palette;
interface LoadingBarProps {
  progress: number;
  indeterminate: boolean;
}
const LoadingBar: React.FC<LoadingBarProps> = ({
  progress,
  indeterminate = false,
}) => (
  <Container>
    <Bar progress={indeterminate ? 100 : progress} />
  </Container>
);

const Container = styled.div`
  position: relative;
  height: ${size.s};
  border-radius: ${size.xs};
  background-color: ${gray.light2};
  border: 1px solid ${gray.base};
  width: 100%;
`;

const Bar = styled.div<{ progress: number }>`
  width: ${({ progress }) => progress}%;
  height: 100%;
  background-color: ${red.base};
  /* border radius left */
  border-top-left-radius: ${size.xs};
  border-bottom-left-radius: ${size.xs};
  ${({ progress }) =>
    progress === 100
      ? `
    /* border radius right */
    border-top-right-radius: ${size.xs};
    border-bottom-right-radius: ${size.xs};
    `
      : ""}

  animation: glowing 1.5s linear infinite;
  @keyframes glowing {
    0% {
      background-color: ${red.base};
      box-shadow: 0 0 5px ${red.base};
    }
    50% {
      background-color: ${red.light1};
      box-shadow: 0 0 5px ${red.light1};
    }
    100% {
      background-color: ${red.base};
      box-shadow: 0 0 5px ${red.base};
    }
  }
`;
export default LoadingBar;
