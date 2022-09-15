import { useState } from "react";
import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { Body } from "@leafygreen-ui/typography";
import Icon, { Size } from "components/Icon";
import { fontSize, size } from "constants/tokens";
import Toggle from "./Toggle";

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
    <FilterRow data-cy={dataCy} visible={isVisible}>
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
        <StyledBadge>FILTER</StyledBadge>
      </LeftContainer>
      <RightContainer>
        <StyledBody>{filterText}</StyledBody>
        <FilterOptions>
          <Toggle leftText="Sensitive" rightText="Insensitive" />
          <Toggle leftText="Match" rightText="Inverse" />
        </FilterOptions>
      </RightContainer>
    </FilterRow>
  );
};

const StyledIcon = styled(Icon)`
  cursor: pointer;
`;

const StyledBadge = styled(Badge)`
  user-select: none;
`;

const FilterRow = styled.div<{
  visible: boolean;
}>`
  display: flex;
  align-items: flex-start;
  svg,
  p,
  div {
    margin-right: ${size.xs};
  }

  ${({ visible }) => !visible && `opacity: 50%;`}
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
