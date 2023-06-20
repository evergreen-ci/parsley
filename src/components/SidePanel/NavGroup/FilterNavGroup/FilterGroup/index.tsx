import { useEffect, useState } from "react";
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
import { Error } from "@leafygreen-ui/typography";
import { useLogWindowAnalytics } from "analytics";
import Accordion from "components/Accordion";
import Icon from "components/Icon";
import IconWithTooltip from "components/IconWithTooltip";
import { TextEllipsis, WordBreak } from "components/styles";
import { CaseSensitivity, MatchType } from "constants/enums";
import { size } from "constants/tokens";
import { Filter } from "types/logs";
import { getRegexpError, validateRegexp } from "utils/validators";

const { gray, red } = palette;

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
  const { sendEvent } = useLogWindowAnalytics();
  const { name, visible, caseSensitive, matchType } = filter;

  const [newFilterName, setNewFilterName] = useState(name);
  const [isEditing, setIsEditing] = useState(false);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (name) {
      setIsValid(validateRegexp(name));
    }
  }, [name]);

  const resetEditState = () => {
    setIsEditing(false);
    setNewFilterName(name);
  };

  const handleSubmit = () => {
    if (isValid) {
      editFilter("name", newFilterName, filter);
      resetEditState();
    }
  };

  const showTooltip = !isValid && !isEditing;
  const validationMessage =
    newFilterName === ""
      ? "Filter cannot be empty"
      : `Invalid Regular Expression: ${getRegexpError(newFilterName)}`;

  return (
    <Accordion
      defaultOpen
      onToggle={({ isVisible }) =>
        sendEvent({ name: "Toggled Filter", open: isVisible })
      }
      title={
        <>
          <Badge>Filter</Badge>
          {showTooltip && (
            <IconWithTooltip color={red.base} glyph="ImportantWithCircle">
              Invalid filter expression, please update it!
              <Error>{validationMessage}</Error>
            </IconWithTooltip>
          )}
          <TextEllipsis>{name}</TextEllipsis>
        </>
      }
      titleTag={AccordionTitle}
      toggledTitle={
        <>
          <Badge>Filter</Badge>
          {showTooltip && (
            <IconWithTooltip color={red.base} glyph="ImportantWithCircle">
              Invalid filter expression, please update it!
              <Error>{validationMessage}</Error>
            </IconWithTooltip>
          )}
          <IconButtonContainer>
            <IconButton
              aria-label="Edit filter"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              title="Edit filter"
            >
              <Icon fill={gray.base} glyph="Edit" />
            </IconButton>
            <IconButton
              aria-label={visible ? "Hide filter" : "Show filter"}
              disabled={!isValid}
              onClick={(e) => {
                e.stopPropagation();
                editFilter("visible", !visible, filter);
              }}
              title={visible ? "Hide filter" : "Show filter"}
            >
              <Icon
                fill={gray.base}
                glyph={isValid && visible ? "Visibility" : "ClosedEye"}
              />
            </IconButton>
            <IconButton
              aria-label="Delete filter"
              onClick={(e) => {
                e.stopPropagation();
                deleteFilter(name);
              }}
              title="Delete filter"
            >
              <Icon fill={gray.base} glyph="X" />
            </IconButton>
          </IconButtonContainer>
        </>
      }
    >
      <FilterWrapper data-cy={dataCy}>
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
              onKeyDown={(e) => e.key === "Enter" && isValid && handleSubmit()}
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
          <WordBreak>{name}</WordBreak>
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
          <Option disabled={!isValid} value={CaseSensitivity.Insensitive}>
            Insensitive
          </Option>
          <Option disabled={!isValid} value={CaseSensitivity.Sensitive}>
            Sensitive
          </Option>
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
          <Option disabled={!isValid} value={MatchType.Exact}>
            Exact
          </Option>
          <Option disabled={!isValid} value={MatchType.Inverse}>
            Inverse
          </Option>
        </StyledSegmentedControl>
      </FilterWrapper>
    </Accordion>
  );
};

const AccordionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: ${size.xxs};
  overflow: hidden;
`;

const IconButtonContainer = styled.div`
  position: absolute;
  right: 0;
`;

const FilterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: ${size.xs};
  padding-right: ${size.xxs};
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

const StyledSegmentedControl = styled(SegmentedControl)`
  margin-top: ${size.xs};
  // Set the labels to have the same width so that the controls are aligned.
  > div:first-of-type {
    width: 46px;
  }
`;

export default FilterGroup;
