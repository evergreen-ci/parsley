import { useState } from "react";
import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import Button, { Variant } from "@leafygreen-ui/button";
import IconButton from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import {
  SegmentedControlOption as Option,
  SegmentedControl,
} from "@leafygreen-ui/segmented-control";
import TextInput from "@leafygreen-ui/text-input";
import { Body } from "@leafygreen-ui/typography";
import Icon from "components/Icon";
import { CaseSensitivity, MatchType } from "constants/enums";
import { size } from "constants/tokens";

const { gray } = palette;

interface FilterProps {
  ["data-cy"]?: string;
  filterName: string;
  deleteFilter: (filter: string) => void;
  editFilter: (oldFilter: string, newFilter: string) => void;
}

const Filter: React.FC<FilterProps> = ({
  "data-cy": dataCy,
  filterName,
  deleteFilter,
  editFilter,
}) => {
  const [newFilter, setNewFilter] = useState(filterName);
  const [isEditing, setIsEditing] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [caseSensitivity, setCaseSensitivity] = useState<string>(
    CaseSensitivity.Insensitive
  );
  const [matchType, setMatchType] = useState<string>(MatchType.Exact);

  const resetEditState = () => {
    setIsEditing(false);
    setNewFilter(filterName);
  };

  return (
    <FilterRow data-cy={dataCy}>
      <FilterLabel>
        <Badge>FILTER</Badge>
        <FilterIcons>
          <IconButton
            aria-label="Edit filter"
            onClick={() => setIsEditing(true)}
          >
            <Icon fill={gray.base} glyph="Edit" />
          </IconButton>
          <IconButton
            aria-label={isVisible ? "Hide filter" : "Show filter"}
            onClick={() => setIsVisible(!isVisible)}
          >
            <Icon
              fill={gray.base}
              glyph={isVisible ? "Visibility" : "ClosedEye"}
            />
          </IconButton>
          <IconButton
            aria-label="Delete filter"
            onClick={() => deleteFilter(filterName)}
          >
            <Icon fill={gray.base} glyph="X" />
          </IconButton>
        </FilterIcons>
      </FilterLabel>

      {isEditing ? (
        <>
          <StyledTextInput
            aria-label="Edit Filter Name"
            data-cy="edit-filter-name"
            onChange={(e) => setNewFilter(e.target.value)}
            placeholder="New filter definition"
            sizeVariant="small"
            spellCheck={false}
            type="search"
            value={newFilter}
          />
          <ButtonWrapper>
            <Button onClick={() => resetEditState()} size="xsmall">
              Cancel
            </Button>
            <Button
              onClick={() => {
                editFilter(filterName, newFilter);
                resetEditState();
              }}
              size="xsmall"
              variant={Variant.PrimaryOutline}
            >
              OK
            </Button>
          </ButtonWrapper>
        </>
      ) : (
        <FilterName>{filterName}</FilterName>
      )}

      <StyledSegmentedControl
        aria-controls="case-sensitivity"
        defaultValue={caseSensitivity}
        label="Case"
        onChange={setCaseSensitivity}
        size="small"
      >
        <Option value={CaseSensitivity.Insensitive}>Insensitive</Option>
        <Option value={CaseSensitivity.Sensitive}>Sensitive</Option>
      </StyledSegmentedControl>

      <StyledSegmentedControl
        aria-controls="match-type"
        defaultValue={matchType}
        label="Match"
        onChange={setMatchType}
        size="small"
      >
        <Option value={MatchType.Exact}>Exact</Option>
        <Option value={MatchType.Inverse}>Inverse</Option>
      </StyledSegmentedControl>
    </FilterRow>
  );
};

const FilterRow = styled.div`
  display: flex;
  flex-direction: column;
`;

const FilterLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FilterIcons = styled.div`
  display: flex;
  align-items: center;
`;

const StyledTextInput = styled(TextInput)`
  margin-top: ${size.xxs};
  width: 100%;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;

  margin-top: ${size.xxs};
  margin-bottom: ${size.xs};
  gap: ${size.xxs};
`;

const FilterName = styled(Body)`
  margin-top: ${size.xxs};
  margin-bottom: ${size.xs};
  padding-left: ${size.xxs};

  font-size: 13px;
  word-break: break-all;
`;

const StyledSegmentedControl = styled(SegmentedControl)`
  margin-bottom: ${size.xs};
  padding-left: ${size.xxs};

  // Set the labels to have the same width so that the controls are aligned.
  > div:first-of-type {
    width: 52px;
  }
`;

export default Filter;
