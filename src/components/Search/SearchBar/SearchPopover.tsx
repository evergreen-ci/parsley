import { useRef, useState } from "react";
import styled from "@emotion/styled";
import Card from "@leafygreen-ui/card";
import IconButton from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import Popover from "@leafygreen-ui/popover";
import { Body, BodyProps } from "@leafygreen-ui/typography";
import Icon from "components/Icon";
import { size } from "constants/tokens";
import { useOnClickOutside } from "hooks";

const { white, blue, gray } = palette;

interface SearchPopoverProps {
  disabled: boolean;
  suggestions: string[];
  onClick?: (suggestion: string) => void;
}

const SearchPopover: React.FC<SearchPopoverProps> = ({
  disabled,
  suggestions,
  onClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useOnClickOutside([buttonRef, popoverRef], () => {
    setIsOpen(false);
  });

  const handleClick = (suggestion: string) => {
    setIsOpen(!isOpen);
    onClick?.(suggestion);
  };

  return (
    <SearchPopoverBox disabled={disabled}>
      <IconButton
        ref={buttonRef}
        aria-labelledby="View search suggestions"
        data-cy="search-suggestion-button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
      >
        <>
          <Icon fill={gray.base} glyph="Bulb" />
          <Icon fill={gray.base} glyph="CaretDown" />
        </>
        <Popover active={isOpen} data-cy="search-suggestion-popover">
          <div ref={popoverRef}>
            <StyledCard>
              {suggestions.length > 0 ? (
                suggestions.map((s) => (
                  <SearchSuggestion
                    key={s}
                    onClick={() => handleClick(s)}
                    role="button"
                  >
                    {s}
                  </SearchSuggestion>
                ))
              ) : (
                <StyledBody>
                  There are no search suggestions available for this project.
                </StyledBody>
              )}
            </StyledCard>
          </div>
        </Popover>
      </IconButton>
    </SearchPopoverBox>
  );
};

const SearchPopoverBox = styled.div<{ disabled: boolean }>`
  display: flex;
  align-items: center;
  height: 36px;
  padding-left: ${size.xs};
  padding-right: ${size.xxs};

  // Styling for when the component should be disabled.
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "auto")};
  background-color: ${({ disabled }) => (disabled ? gray.light2 : white)};
  border: 1px solid ${({ disabled }) => (disabled ? gray.light1 : gray.base)};
  border-right: 0;
  border-left: 0;
`;

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: ${size.xs};
  border-radius: ${size.s};

  width: 400px;
  min-height: 48px;
  max-height: 600px;
  overflow: scroll;
`;

const StyledBody = styled(Body)<BodyProps>`
  text-align: center;
`;

const SearchSuggestion = styled.div`
  padding: ${size.xs};
  border-radius: ${size.xs};
  word-break: break-all;
  :hover {
    cursor: pointer;
    background-color: ${blue.light3};
  }
`;

export default SearchPopover;
