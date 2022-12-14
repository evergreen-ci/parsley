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
import { Filter } from "types/logs";
import { validateRegexp } from "utils/validators";

const { gray } = palette;

interface FilterGroupProps {
  ["data-cy"]?: string;
  filter: Filter;
  deleteFilter: (filter: string) => void;
  editFilter: (
    fieldName: keyof Filter,
    fieldValue: MatchType | CaseSensitivity | boolean | string,
    filter: Filter
  ) => void;
}

const FilterGroup: React.FC<FilterGroupProps> = ({
  "data-cy": dataCy,
  filter,
  deleteFilter,
  editFilter,
}) => {
  const { name, visible, caseSensitive, matchType } = filter;

  const [newFilterName, setNewFilterName] = useState(name);
  const [isEditing, setIsEditing] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const resetEditState = () => {
    setIsEditing(false);
    setNewFilterName(name);
    setIsValid(true);
  };

  const handleSubmit = () => {
    if (isValid) {
      editFilter("name", newFilterName, filter);
      resetEditState();
    }
  };

  const validationMessage =
    newFilterName === ""
      ? "Filter cannot be empty"
      : "Invalid regular expression";

  return (
    <FilterContainer data-cy={dataCy}>
      <FilterHeader>
        <Badge>FILTER</Badge>
        <IconButtonContainer>
          <IconButton
            aria-label="Edit filter"
            onClick={() => setIsEditing(true)}
            title="Edit filter"
          >
            <Icon fill={gray.base} glyph="Edit" />
          </IconButton>

          <IconButton
            aria-label={visible ? "Hide filter" : "Show filter"}
            onClick={() => editFilter("visible", !visible, filter)}
            title={visible ? "Hide filter" : "Show filter"}
          >
            <Icon
              fill={gray.base}
              glyph={visible ? "Visibility" : "ClosedEye"}
            />
          </IconButton>

          <IconButton
            aria-label="Delete filter"
            onClick={() => deleteFilter(name)}
            title="Delete filter"
          >
            <Icon fill={gray.base} glyph="X" />
          </IconButton>
        </IconButtonContainer>
      </FilterHeader>

      {isEditing ? (
        <>
          <StyledTextInput
            aria-label="Edit filter name"
            aria-labelledby="Edit filter name"
            autoFocus
            data-cy="edit-filter-name"
            errorMessage={isValid ? "" : validationMessage}
            onChange={(e) => {
              setNewFilterName(e.target.value);
              setIsValid(
                validateRegexp(e.target.value) && e.target.value !== ""
              );
            }}
            onKeyPress={(e) => e.key === "Enter" && isValid && handleSubmit()}
            placeholder="New filter definition"
            sizeVariant="small"
            spellCheck={false}
            state={isValid ? "none" : "error"}
            type="text"
            value={newFilterName}
          />
          <ButtonWrapper>
            <Button onClick={() => resetEditState()} size="xsmall">
              Cancel
            </Button>
            <Button
              disabled={!isValid}
              onClick={handleSubmit}
              size="xsmall"
              variant={Variant.PrimaryOutline}
            >
              Apply
            </Button>
          </ButtonWrapper>
        </>
      ) : (
        <FilterName>{name}</FilterName>
      )}

      <StyledSegmentedControl
        aria-controls="Toggle case sensitivity"
        defaultValue={caseSensitive}
        label="Case"
        onChange={(value) =>
          editFilter("caseSensitive", value as CaseSensitivity, filter)
        }
        size="small"
      >
        <Option value={CaseSensitivity.Insensitive}>Insensitive</Option>
        <Option value={CaseSensitivity.Sensitive}>Sensitive</Option>
      </StyledSegmentedControl>

      <StyledSegmentedControl
        aria-controls="Toggle match type"
        defaultValue={matchType}
        label="Match"
        onChange={(value) =>
          editFilter("matchType", value as MatchType, filter)
        }
        size="small"
      >
        <Option value={MatchType.Exact}>Exact</Option>
        <Option value={MatchType.Inverse}>Inverse</Option>
      </StyledSegmentedControl>
    </FilterContainer>
  );
};

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const IconButtonContainer = styled.div`
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
    width: 46px;
  }
`;

export default FilterGroup;
