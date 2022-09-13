import { useState } from "react";
import styled from "@emotion/styled";
import Button, { Variant } from "@leafygreen-ui/button";
import { size } from "constants/tokens";

export enum ToggleButton {
  Left = "left",
  Right = "right",
}

interface ToggleProps {
  activeButton?: ToggleButton.Left | ToggleButton.Right;
  ["data-cy"]?: string;
  leftText: string;
  rightText: string;
}

const Toggle: React.FC<ToggleProps> = ({
  activeButton = "left",
  "data-cy": dataCy,
  leftText,
  rightText,
}) => {
  const [active, setActive] = useState<string>(activeButton);
  const leftVariant =
    active === ToggleButton.Left ? Variant.Primary : Variant.Default;
  const rightVariant =
    active === ToggleButton.Right ? Variant.Primary : Variant.Default;

  const changeActiveButton = (newActive: string) => {
    if (active !== newActive) {
      setActive(newActive);
    }
  };

  return (
    <div data-cy={dataCy}>
      <LeftButton
        onClick={() => changeActiveButton(ToggleButton.Left)}
        variant={leftVariant}
      >
        {rightText}
      </LeftButton>
      <RightButton
        onClick={() => changeActiveButton(ToggleButton.Right)}
        variant={rightVariant}
      >
        {leftText}
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
