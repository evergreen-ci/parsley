import { KeyboardEvent, useMemo, useState } from "react";
import styled from "@emotion/styled";
import IconButton from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import { Option, Select } from "@leafygreen-ui/select";
import Icon from "components/Icon";
import IconWithTooltip from "components/IconWithTooltip";
import TextInputWithGlyph from "components/TextInputWithGlyph";
import debounce from "utils/debounce";

const { yellow } = palette;
interface SearchBarProps {
  disabled?: boolean;
  validator?: (value: string) => boolean;
  validatorMessage?: string;
  className?: string;
  onSubmit?: (selected: string, value: string) => void;
  onChange?: (selected: string, value: string) => void;
  shouldClearOnSubmit?: (selected: string) => boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  className,
  disabled = false,
  onChange,
  onSubmit,
  shouldClearOnSubmit = () => true,
  validator = () => true,
  validatorMessage = "Invalid Input",
}) => {
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState("search");

  const isValid = validator(input);
  const handleOnSubmit = () => {
    if (isValid) {
      if (shouldClearOnSubmit(selected)) {
        setInput("");
      }
      onSubmit?.(selected, input);
    }
  };

  // debounce the onChange handler to prevent excessive rerenders
  const debouncedHandleOnChangeCallback = useMemo(
    () => debounce((value: string) => onChange?.(selected, value), 1000),
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
        onChange={(v) => setSelected(v)}
        value={selected}
      >
        <Option key="search" data-cy="search-option" value="search">
          Search
        </Option>
        <Option key="filter" data-cy="filter-option" value="filter">
          Filter
        </Option>
      </StyledSelect>
      <StyledInput
        aria-label="searchbar-input"
        data-cy="searchbar-input"
        disabled={disabled}
        icon={
          isValid ? (
            <IconButton
              aria-label="Select plus button"
              data-cy="searchbar-submit"
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
          e.key === "Enter" && handleOnSubmit()
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
