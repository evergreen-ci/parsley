import { useState } from "react";
import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import IconButton from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import {
  SegmentedControlOption as Option,
  SegmentedControl,
} from "@leafygreen-ui/segmented-control";
import { Body } from "@leafygreen-ui/typography";
import Icon, { Size } from "components/Icon";
import { fontSize, size } from "constants/tokens";

const { gray } = palette;

enum CaseSensitivity {
  Sensitive = "sensitive",
  Insensitive = "insensitive",
}

enum MatchType {
  Exact = "exact",
  Inverse = "inverse",
}

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
  const [caseSensitivity, setCaseSensitivity] = useState<string>(
    CaseSensitivity.Insensitive
  );
  const [matchType, setMatchType] = useState<string>(MatchType.Exact);

  const toggleVisible = () => {
    setIsVisible(!isVisible);
  };

  return (
    <FilterRow data-cy={dataCy}>
      <LeftContainer>
        <IconButton
          aria-label="Delete filter button"
          onClick={() => deleteFilter(filterText)}
          size={Size.Large}
        >
          <Icon fill={gray.dark1} glyph="X" />
        </IconButton>
        <IconButton
          aria-label="Visibility filter button"
          onClick={() => toggleVisible()}
          size={Size.Large}
        >
          <Icon
            fill={gray.dark1}
            glyph={isVisible ? "Visibility" : "ClosedEye"}
          />
        </IconButton>
        <StyledBadge>FILTER</StyledBadge>
      </LeftContainer>

      <RightContainer>
        <StyledBody>{filterText}</StyledBody>
        <FilterOptions>
          <SegmentedControl
            defaultValue={caseSensitivity}
            onChange={setCaseSensitivity}
          >
            <Option value={CaseSensitivity.Insensitive}>Insensitive</Option>
            <Option value={CaseSensitivity.Sensitive}>Sensitive</Option>
          </SegmentedControl>
          <SegmentedControl defaultValue={matchType} onChange={setMatchType}>
            <Option value={MatchType.Exact}>Match</Option>
            <Option value={MatchType.Inverse}>Inverse</Option>
          </SegmentedControl>
        </FilterOptions>
      </RightContainer>
    </FilterRow>
  );
};

const FilterRow = styled.div`
  display: flex;
  align-items: flex-start;
`;

const StyledBadge = styled(Badge)`
  user-select: none;
  margin: 0 ${size.xs};
`;

const LeftContainer = styled.div`
  display: flex;
  align-items: center;
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: ${size.xs};
  margin-top: ${size.xs};
`;

const StyledBody = styled(Body)`
  font-size: ${fontSize.m};
  word-break: break-all;
`;

const FilterOptions = styled.div`
  display: flex;
  margin-top: ${size.xs};
  > * {
    margin-right: ${size.xs};
  }
`;

export default Filter;
