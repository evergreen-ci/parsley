import { useState } from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { size } from "constants/tokens";

interface FilterToggleProps {
  activeButton?: string;
  ["data-cy"]?: string;
  leftText: string;
  rightText: string;
}

const FilterToggle: React.FC<FilterToggleProps> = ({
  activeButton = "left",
  "data-cy": dataCy,
  leftText,
  rightText,
}) => {
  const [active, setActive] = useState<string>(activeButton);
  const leftVariant = active === "left" ? "primary" : "default";
  const rightVariant = active === "right" ? "primary" : "default";

  const changeActiveButton = (newActive: string) => {
    if (active !== newActive) {
      setActive(newActive);
    }
  };

  return (
    <div data-cy={dataCy}>
      <LeftButton
        onClick={() => changeActiveButton("left")}
        variant={leftVariant}
      >
        {rightText}
      </LeftButton>
      <RightButton
        onClick={() => changeActiveButton("right")}
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

export default FilterToggle;
