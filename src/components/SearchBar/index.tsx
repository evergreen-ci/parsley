import { KeyboardEvent, useMemo, useRef, useState } from "react";
import styled from "@emotion/styled";
import IconButton from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import { Option, Select } from "@leafygreen-ui/select";
import Icon from "components/Icon";
import IconWithTooltip from "components/IconWithTooltip";
import TextInputWithGlyph from "components/TextInputWithGlyph";
import { SearchBarActions } from "constants/enums";
import { CharKey, ModifierKey } from "constants/keys";
import { zIndex } from "constants/tokens";
import { useKeyboardShortcut } from "hooks";
import debounce from "utils/debounce";

const { yellow } = palette;
interface SearchBarProps {
  disabled?: boolean;
  validator?: (value: string) => boolean;
  validatorMessage?: string;
  className?: string;
  onSubmit?: (selected: string, value: string) => void;
  onChange?: (selected: string, value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  className,
  disabled = false,
  onChange = () => {},
  onSubmit = () => {},
  validator = () => true,
  validatorMessage = "Invalid Input",
}) => {
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState(SearchBarActions.Search);

  const isFilter = selected === SearchBarActions.Filter;
  const isValid = validator(input);

  const inputRef = useRef<HTMLInputElement>(null);

  useKeyboardShortcut(
    { charKey: CharKey.F, modifierKeys: [ModifierKey.Control] },
    () => {
      if (inputRef.current) inputRef.current.focus();
    },
    { disabled, overrideIgnore: true }
  );

  useKeyboardShortcut(
    { charKey: CharKey.S, modifierKeys: [ModifierKey.Control] },
    () =>
      selected === SearchBarActions.Search
        ? setSelected(SearchBarActions.Filter)
        : setSelected(SearchBarActions.Search),
    { disabled, overrideIgnore: true }
  );

  const handleOnSubmit = () => {
    if (inputRef.current) {
      inputRef.current.blur();
    }
    if (isFilter) {
      setInput("");
    }
    onSubmit(selected, input);
  };

  // debounce the onChange handler to prevent excessive rerenders
  const debouncedHandleOnChangeCallback = useMemo(
    () => debounce((value: string) => onChange(selected, value), 1000),
    [selected, onChange]
  );

  const handleOnChange = (value: string) => {
    setInput(value);
    if (validator(value)) {
      debouncedHandleOnChangeCallback(value);
    }
  };

  return (
    <Container className={className}>
      <StyledSelect
        allowDeselect={false}
        aria-labelledby="searchbar-select"
        data-cy="searchbar-select"
        disabled={disabled}
        onChange={(v) => setSelected(v as SearchBarActions)}
        popoverZIndex={zIndex.popover}
        value={selected}
      >
        <Option
          key={SearchBarActions.Search}
          data-cy="search-option"
          value={SearchBarActions.Search}
        >
          Search
        </Option>
        <Option
          key={SearchBarActions.Filter}
          data-cy="filter-option"
          value={SearchBarActions.Filter}
        >
          Filter
        </Option>
      </StyledSelect>
      <StyledInput
        ref={inputRef}
        aria-label="searchbar-input"
        data-cy="searchbar-input"
        disabled={disabled}
        icon={
          isValid ? (
            <IconButton
              aria-label="Select plus button"
              data-cy="searchbar-submit"
              disabled={disabled || input.length === 0}
              onClick={handleOnSubmit}
            >
              <Icon glyph="Plus" />
            </IconButton>
          ) : (
            <IconWithTooltip
              data-cy="searchbar-warning"
              fill={yellow.base}
              glyph="Warning"
            >
              {validatorMessage}
            </IconWithTooltip>
          )
        }
        onChange={(e) => handleOnChange(e.target.value)}
        onKeyPress={(e: KeyboardEvent<HTMLInputElement>) =>
          e.key === "Enter" && isValid && handleOnSubmit()
        }
        placeholder="optional, regexp to search"
        spellCheck={false}
        type="search"
        value={input}
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

// @ts-expect-error
const StyledSelect = styled(Select)`
  width: 120px;
  /* overwrite lg borders https://jira.mongodb.org/browse/PD-1995 */
  button {
    margin-top: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right: 0;
  }
`;

const StyledInput = styled(TextInputWithGlyph)`
  /* overwrite lg borders https://jira.mongodb.org/browse/PD-1995 */
  div input {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
`;

export default SearchBar;
