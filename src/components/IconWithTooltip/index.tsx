import styled from "@emotion/styled";
import Tooltip from "@leafygreen-ui/tooltip";
import Icon from "components/Icon";

interface IconWithTooltipProps extends React.ComponentProps<typeof Icon> {
  ["data-cy"]?: string;
}

const IconWithTooltip: React.FC<IconWithTooltipProps> = ({
  children,
  "data-cy": dataCy,
  ...rest
}) => (
  <StyledTooltip
    align="top"
    justify="middle"
    trigger={
      <IconWrapper data-cy={dataCy}>
        <Icon {...rest} />
      </IconWrapper>
    }
    triggerEvent="hover"
  >
    {children}
  </StyledTooltip>
);

// @ts-expect-error
const StyledTooltip = styled(Tooltip)`
  max-width: 300px;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export default IconWithTooltip;
