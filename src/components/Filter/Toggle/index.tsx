import styled from "@emotion/styled";
import Button, { Variant } from "@leafygreen-ui/button";
import { size } from "constants/tokens";

interface ToggleProps {
  value: boolean;
  onChange: (newValue: boolean) => void;
  ["data-cy"]?: string;
  leftText: string;
  rightText: string;
}

const Toggle: React.FC<ToggleProps> = ({
  value,
  onChange,
  "data-cy": dataCy,
  leftText,
  rightText,
}) => {
  const leftVariant = value ? Variant.Primary : Variant.Default;
  const rightVariant = value ? Variant.Default : Variant.Primary;

  const changeActiveButton = (newActive: boolean) => {
    if (value !== newActive) {
      onChange(newActive);
    }
  };

  return (
    <div data-cy={dataCy}>
      <LeftButton
        onClick={() => changeActiveButton(true)}
        variant={leftVariant}
      >
        {leftText}
      </LeftButton>
      <RightButton
        onClick={() => changeActiveButton(false)}
        variant={rightVariant}
      >
        {rightText}
      </RightButton>
    </div>
  );
};

const LeftButton = styled(Button)`
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  width: ${size.xxl};
`;

const RightButton = styled(Button)`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  width: ${size.xxl};
`;

export default Toggle;
