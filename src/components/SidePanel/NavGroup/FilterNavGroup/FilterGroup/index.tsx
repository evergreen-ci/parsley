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
import { Body, BodyProps, Error } from "@leafygreen-ui/typography";
import { useLogWindowAnalytics } from "analytics";
import Accordion from "components/Accordion";
import Icon from "components/Icon";
import IconWithTooltip from "components/IconWithTooltip";
import { TextEllipsis } from "components/styles";
import { CaseSensitivity, MatchType } from "constants/enums";
import { size } from "constants/tokens";
import { Filter } from "types/logs";
import { getRegexpError, validateRegexp } from "utils/validators";

const { gray, red } = palette;

interface FilterGroupProps {
  filter: Filter;
  deleteFilter: (filter: string) => void;
  editFilter: (
    fieldName: keyof Filter,
    fieldValue: MatchType | CaseSensitivity | boolean | string,
    filter: Filter,
  ) => void;
}

const FilterGroup: React.FC<FilterGroupProps> = ({
  deleteFilter,
  editFilter,
  filter,
}) => {
  const { sendEvent } = useLogWindowAnalytics();
  const { caseSensitive, expression, matchType, visible } = filter;

  const [newFilterExpression, setNewFilterExpression] = useState(expression);
  const [isEditing, setIsEditing] = useState(false);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (expression) {
      setIsValid(validateRegexp(expression));
    }
  }, [expression]);

  const resetEditState = () => {
    setIsEditing(false);
    setNewFilterExpression(expression);
  };

  const handleSubmit = () => {
    if (isValid) {
      editFilter("expression", newFilterExpression, filter);
      resetEditState();
    }
  };

  const showTooltip = !isValid && !isEditing;
  const validationMessage =
    newFilterExpression === ""
      ? "Filter cannot be empty"
      : `Invalid Regular Expression: ${getRegexpError(newFilterExpression)}`;

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
          <TextEllipsis>{expression}</TextEllipsis>
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
                deleteFilter(expression);
              }}
              title="Delete filter"
            >
              <Icon fill={gray.base} glyph="X" />
            </IconButton>
          </IconButtonContainer>
        </>
      }
    >
      <AccordionContent>
        {isEditing ? (
          <>
            <StyledTextInput
              aria-label="Edit filter name"
              aria-labelledby="Edit filter name"
              autoFocus
              data-cy="edit-filter-name"
              errorMessage={isValid ? "" : validationMessage}
              onChange={(e) => {
                setNewFilterExpression(e.target.value);
                setIsValid(
                  validateRegexp(e.target.value) && e.target.value !== "",
                );
              }}
              onKeyDown={(e) => e.key === "Enter" && isValid && handleSubmit()}
              placeholder="New filter definition"
              sizeVariant="small"
              spellCheck={false}
              state={isValid ? "none" : "error"}
              type="text"
              value={newFilterExpression}
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
          <StyledBody>{expression}</StyledBody>
        )}

        <StyledSegmentedControl
          aria-controls="Toggle case sensitivity"
          defaultValue={caseSensitive}
          label="Case"
          onChange={(value) =>
            editFilter("caseSensitive", value as CaseSensitivity, filter)
          }
          size="xsmall"
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
          size="xsmall"
        >
          <Option disabled={!isValid} value={MatchType.Exact}>
            Exact
          </Option>
          <Option disabled={!isValid} value={MatchType.Inverse}>
            Inverse
          </Option>
        </StyledSegmentedControl>
      </AccordionContent>
    </Accordion>
  );
};

const AccordionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: ${size.xxs};
  overflow: hidden;
`;

const AccordionContent = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: ${size.xs};
  padding-right: ${size.xxs};
`;

const IconButtonContainer = styled.div`
  position: absolute;
  right: 0;
`;

const StyledTextInput = styled(TextInput)`
  margin-top: ${size.xxs};
  width: 100%;
`;

const StyledBody = styled(Body)<BodyProps>`
  word-break: break-all;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${size.xxs};
  margin-top: ${size.xs};
`;

const StyledSegmentedControl = styled(SegmentedControl)`
  margin-top: ${size.xs};
  // Set the labels to have the same width so that the controls are aligned.
  > div:first-of-type {
    width: 44px;
  }
`;

export default FilterGroup;
