import { KeyboardEvent, useRef, useState } from "react";
import styled from "@emotion/styled";
import IconButton from "@leafygreen-ui/icon-button";
import { Option, Select } from "@leafygreen-ui/select";
import Tooltip from "@leafygreen-ui/tooltip";
import debounce from "lodash.debounce";
import { useLogWindowAnalytics } from "analytics";
import Icon from "components/Icon";
import TextInputWithGlyph from "components/TextInputWithGlyph";
import { SearchBarActions } from "constants/enums";
import { CharKey, ModifierKey } from "constants/keys";
import { size, textInputHeight, zIndex } from "constants/tokens";
import { DIRECTION } from "context/LogContext/types";
import { useKeyboardShortcut } from "hooks";
import { SentryBreadcrumb, leaveBreadcrumb } from "utils/errorReporting";
import SearchPopover from "./SearchPopover";

interface SearchBarProps {
  className?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  onSubmit?: (selected: string, value: string) => void;
  paginate?: (dir: DIRECTION) => void;
  searchSuggestions?: string[];
  validator?: (value: string) => boolean;
  validatorMessage?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  className,
  disabled = false,
  onChange = () => {},
  onSubmit = () => {},
  paginate = () => {},
  searchSuggestions = [],
  validator = () => true,
  validatorMessage = "Invalid input",
}) => {
  const { sendEvent } = useLogWindowAnalytics();
  const inputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState(SearchBarActions.Filter);

  const isValid = validator(input);
  const debounceSearch = useRef(
    debounce((value: string) => {
      onChange(value);
    }, 500)
  ).current;

  useKeyboardShortcut(
    { charKey: CharKey.F, modifierKeys: [ModifierKey.Control] },
    () => {
      inputRef.current?.focus();
      inputRef.current?.select();
    },
    { disabled, ignoreFocus: true }
  );

  useKeyboardShortcut(
    { charKey: CharKey.S, modifierKeys: [ModifierKey.Control] },
    () => {
      // Iterate through SearchBarActions and select the next one.
      const SearchBarActionValues = Object.values(SearchBarActions);
      const keyIndex =
        (SearchBarActionValues.indexOf(selected) + 1) %
        SearchBarActionValues.length;
      const nextKey = Object.keys(SearchBarActions)[
        keyIndex
      ] as keyof typeof SearchBarActions;
      setSelected(SearchBarActions[nextKey]);
    },
    { disabled, ignoreFocus: true }
  );

  const handleChangeSelect = (value: string) => {
    setSelected(value as SearchBarActions);
    leaveBreadcrumb("search-bar-select", { value }, SentryBreadcrumb.User);
  };

  const handleOnSubmit = () => {
    debounceSearch.cancel(); // Cancel the debounce request to prevent delayed search.
    inputRef.current?.blur();
    setInput("");
    leaveBreadcrumb(
      "search-bar-submit",
      { input, selected },
      SentryBreadcrumb.User
    );
    onSubmit(selected, input);
  };

  const handleOnChange = (value: string) => {
    setInput(value);
    if (validator(value)) {
      debounceSearch(value);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const commandKey = e.ctrlKey || e.metaKey;
    if (e.key === "Enter" && commandKey && isValid) {
      handleOnSubmit();
    } else if (e.key === "Enter" && e.shiftKey) {
      paginate(DIRECTION.PREVIOUS);
      sendEvent({
        direction: DIRECTION.PREVIOUS,
        name: "Paginated Through Search Results",
      });
    } else if (e.key === "Enter") {
      paginate(DIRECTION.NEXT);
      sendEvent({
        direction: DIRECTION.NEXT,
        name: "Paginated Through Search Results",
      });
    }
  };

  return (
    <Container className={className}>
      <StyledSelect
        allowDeselect={false}
        aria-labelledby="searchbar-select"
        data-cy="searchbar-select"
        disabled={disabled}
        onChange={handleChangeSelect}
        popoverZIndex={zIndex.popover}
        value={selected}
      >
        <Option
          key={SearchBarActions.Filter}
          data-cy="filter-option"
          value={SearchBarActions.Filter}
        >
          Filter
        </Option>
        <Option
          key={SearchBarActions.Highlight}
          data-cy="highlight-option"
          value={SearchBarActions.Highlight}
        >
          Highlight
        </Option>
      </StyledSelect>
      <InputWrapper>
        <IconButtonWrapper>
          <SearchPopover
            disabled={disabled}
            onClick={(suggestion) => {
              handleOnChange(suggestion);
              inputRef.current?.focus();
              sendEvent({ name: "Applied Search Suggestion", suggestion });
              leaveBreadcrumb(
                "applied-search-suggestion",
                { suggestion },
                SentryBreadcrumb.User
              );
            }}
            searchSuggestions={searchSuggestions}
          />
        </IconButtonWrapper>
        <StyledInput
          ref={inputRef}
          aria-labelledby="searchbar-input"
          data-cy="searchbar-input"
          disabled={disabled}
          icon={
            isValid ? (
              <IconButton
                aria-label="Select plus"
                data-cy="searchbar-submit"
                disabled={disabled || input.length === 0}
                onClick={handleOnSubmit}
              >
                <Icon glyph="Plus" />
              </IconButton>
            ) : (
              <Tooltip
                justify="middle"
                trigger={<IconPlaceholder data-cy="searchbar-error" />}
                triggerEvent="hover"
              >
                {validatorMessage}
              </Tooltip>
            )
          }
          onChange={(e) => handleOnChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="optional, regexp to search"
          spellCheck={false}
          state={isValid ? "none" : "error"}
          type="text"
          value={input}
        />
      </InputWrapper>
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
  }
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledInput = styled(TextInputWithGlyph)`
  /* overwrite lg borders https://jira.mongodb.org/browse/PD-1995 */
  div input {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-left: 0;
    padding-left: 42px;
  }
`;

const IconButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  position: absolute;
  bottom: 0;
  left: ${size.xxs};

  z-index: 1;
  width: ${size.l};
  height: ${textInputHeight};
`;

const IconPlaceholder = styled.div`
  height: 100%;
  width: ${size.l};
`;

export default SearchBar;
