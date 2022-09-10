import { useState } from "react";
import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import Button, { Variant } from "@leafygreen-ui/button";
import { Body } from "@leafygreen-ui/typography";
import Icon, { Size } from "components/Icon";
import { fontSize, size } from "constants/tokens";

interface FilterToggleProps {
  activeButton?: "left" | "right";
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
  const leftVariant = active === "left" ? Variant.Primary : Variant.Default;
  const rightVariant = active === "right" ? Variant.Primary : Variant.Default;

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

interface FilterProps {
  ["data-cy"]?: string;
  filterText: string;
  deleteFilter: (filter: string) => void;
}

const Filter: React.FC<FilterProps> = ({
  "data-cy": dataCy,
  filterText,
  deleteFilter,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisible = () => {
    setIsVisible(!isVisible);
  };

  return (
    <FilterRow data-cy={dataCy}>
      <LeftContainer>
        <StyledIcon
          glyph="X"
          onClick={() => deleteFilter(filterText)}
          size={Size.XLarge}
        />
        <StyledIcon
          glyph={isVisible ? "Visibility" : "ClosedEye"}
          onClick={() => toggleVisible()}
          size={Size.XLarge}
        />
        <StyledBadge> FILTER </StyledBadge>
      </LeftContainer>
      <RightContainer>
        <StyledBody>{filterText}</StyledBody>
        <FilterOptions>
          <FilterToggle leftText="Sensitive" rightText="Insensitive" />
          <FilterToggle leftText="Match" rightText="Inverse" />
        </FilterOptions>
      </RightContainer>
    </FilterRow>
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

const StyledIcon = styled(Icon)`
  cursor: pointer;
`;

const StyledBadge = styled(Badge)`
  user-select: none;
`;

const FilterRow = styled.div`
  display: flex;
  align-items: flex-start;
  margin: ${size.s} 0;
  svg,
  p,
  div {
    margin-right: ${size.xs};
  }
`;

const LeftContainer = styled.div`
  display: flex;
  align-items: center;
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: ${size.xs};
`;

const StyledBody = styled(Body)`
  font-size: ${fontSize.m};
  word-break: break-all;
`;

const FilterOptions = styled.div`
  display: flex;
  margin-top: ${size.xs};
`;

export default Filter;
