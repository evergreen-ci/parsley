import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { size } from "constants/tokens";

const { gray, green } = palette;
interface LoadingBarProps {
  progress?: number;
  indeterminate: boolean;
}
const LoadingBar: React.FC<LoadingBarProps> = ({
  indeterminate = false,
  progress = 100,
}) => (
  <Container>
    <Bar
      indeterminate={indeterminate}
      progress={indeterminate ? 100 : progress}
    />
  </Container>
);

const Container = styled.div`
  height: inherit;
  background-color: ${gray.light2};
  border-radius: ${size.xxs};
  width: 100%;
  overflow: hidden;
`;

const Bar = styled.div<{ progress: number; indeterminate: boolean }>`
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
  height: 6px;
  background-color: ${green.base};
  ${({ indeterminate, progress }) =>
    indeterminate
      ? indeterminateAnimation
      : `  width: ${progress}%;
`}
  box-shadow: 0 0 ${size.xs} ${green.light2};
`;

const indeterminateAnimation = css`
  position: relative;
  bottom: 0;
  top: 0;
  width: 50%;

  /* Move the bar infinitely */
  animation: none;
  transform: translateX(-50%);
  animation-name: indeterminate-progress-bar;
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;

  @keyframes indeterminate-progress-bar {
    0% {
      transform: translateX(-150%);
    }
    100% {
      transform: translateX(200%);
    }
  }
`;

export default LoadingBar;
