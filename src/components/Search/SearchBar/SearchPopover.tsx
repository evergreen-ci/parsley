import { useRef, useState } from "react";
import styled from "@emotion/styled";
import Card from "@leafygreen-ui/card";
import IconButton from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import Popover from "@leafygreen-ui/popover";
import {
  Body,
  BodyProps,
  Overline,
  OverlineProps,
} from "@leafygreen-ui/typography";
import Icon from "components/Icon";
import { size, zIndex } from "constants/tokens";
import { useOnClickOutside } from "hooks";

const { blue, gray } = palette;

interface SearchPopoverProps {
  disabled?: boolean;
  searchSuggestions: string[];
  onClick?: (suggestion: string) => void;
}

const SearchPopover: React.FC<SearchPopoverProps> = ({
  disabled = false,
  searchSuggestions,
  onClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useOnClickOutside([buttonRef, popoverRef], () => {
    setIsOpen(false);
  });

  const handleClick = (suggestion: string) => {
    setIsOpen(false);
    onClick?.(suggestion);
  };

  return (
    <>
      <IconButton
        ref={buttonRef}
        aria-labelledby="View search suggestions"
        data-cy="search-suggestion-button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        title="View search suggestions"
      >
        <>
          <Icon fill={gray.base} glyph="Bulb" />
          <Icon fill={gray.base} glyph="CaretDown" />
        </>
      </IconButton>
      <Popover
        active={isOpen}
        data-cy="search-suggestion-popover"
        popoverZIndex={zIndex.popover}
        usePortal={false}
      >
        <div ref={popoverRef}>
          <StyledCard>
            <Title>Search suggestions</Title>
            <Divider />
            <Scrollable>
              {searchSuggestions.length > 0 ? (
                searchSuggestions.map((s) => (
                  <SearchSuggestion key={s} onClick={() => handleClick(s)}>
                    {s}
                  </SearchSuggestion>
                ))
              ) : (
                <StyledBody>
                  No suggestions available for this project.
                </StyledBody>
              )}
            </Scrollable>
          </StyledCard>
        </div>
      </Popover>
    </>
  );
};

const StyledCard = styled(Card)`
  text-align: left;
  overflow: hidden;
  border-radius: ${size.s};
  padding: 0;
`;

const Scrollable = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  max-height: 400px;
  overflow-y: scroll;
`;

const Title = styled(Overline)<OverlineProps>`
  padding-top: ${size.xs};
  padding-left: ${size.s};
`;

const StyledBody = styled(Body)<BodyProps>`
  padding-left: ${size.s};
`;

const Divider = styled.hr`
  border: 0;
  border-bottom: 1px solid ${gray.light2};
  margin: ${size.xxs} 0;
`;

const SearchSuggestion = styled.button`
  // Remove native button styles.
  border: 0;
  background: none;
  text-align: inherit;
  font: inherit;

  padding: ${size.xs} ${size.s};
  word-break: break-all;
  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${blue.light3};
  }
`;

export default SearchPopover;
