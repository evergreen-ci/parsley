import { useRef, useState } from "react";
import styled from "@emotion/styled";
import Card from "@leafygreen-ui/card";
import IconButton from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import Popover from "@leafygreen-ui/popover";
import Icon from "components/Icon";
import { size } from "constants/tokens";
import { useOnClickOutside } from "hooks";

const { blue, gray } = palette;

interface SearchPopoverProps {
  suggestions: string[];
  onClick?: (suggestion: string) => void;
}

const SearchPopover: React.FC<SearchPopoverProps> = ({
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
    <IconButton
      ref={buttonRef}
      aria-labelledby="search-suggestions"
      data-cy="search-suggestion-button"
      onClick={() => setIsOpen(!isOpen)}
    >
      <>
        <Icon fill={gray.base} glyph="Bulb" />
        <Icon fill={gray.base} glyph="CaretDown" />
      </>
      <Popover active={isOpen} data-cy="search-suggestion-popover">
        <div ref={popoverRef}>
          <StyledCard>
            {suggestions.map((s) => (
              <SearchSuggestion
                key={s}
                onClick={() => handleClick(s)}
                role="button"
              >
                {s}
              </SearchSuggestion>
            ))}
          </StyledCard>
        </div>
      </Popover>
    </IconButton>
  );
};

const StyledCard = styled(Card)`
  padding: ${size.xs};
  border-radius: ${size.s};
  width: 400px;
  max-height: 600px;
  overflow: scroll;
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
