import styled from "@emotion/styled";
import { Body } from "@leafygreen-ui/typography";
import LoadingBar from "components/LoadingBar";
import { fontSize } from "constants/tokens";

interface LoadingAnimationProps {}
const LoadingAnimation: React.FC<LoadingAnimationProps> = () => (
  <AnimateIn>
    <StyledBody>Loading log...</StyledBody>
    <LoadingBar indeterminate />
  </AnimateIn>
);

const StyledBody = styled(Body)`
  font-size: ${fontSize.l};
`;

const AnimateIn = styled.div`
  animation: fadein 0.5s;
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
