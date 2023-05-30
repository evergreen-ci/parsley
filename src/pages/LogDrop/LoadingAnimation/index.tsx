import styled, { StyledComponent } from "@emotion/styled";
import { Body, BodyProps } from "@leafygreen-ui/typography";
import LoadingBar from "components/LoadingBar";
import { fontSize, size } from "constants/tokens";

interface LoadingAnimationProps {}
const LoadingAnimation: React.FC<LoadingAnimationProps> = () => (
  <AnimateIn>
    <StyledBody>Loading log...</StyledBody>
    <LoadingBar indeterminate />
  </AnimateIn>
);

const StyledBody = styled(Body)`
  font-size: ${fontSize.l};
  margin-bottom: ${size.xs};
` as StyledComponent<BodyProps>;

const AnimateIn = styled.div`
  animation: fadein 0.5s;
  width: 100%;
  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export default LoadingAnimation;
