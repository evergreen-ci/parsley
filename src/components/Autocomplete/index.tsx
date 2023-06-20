import {
  ChangeEvent,
  KeyboardEvent,
  forwardRef,
  useCallback,
  useEffect,
  useState,
} from "react";
import styled from "@emotion/styled";
import { useControlledValue, useForwardedRef } from "@leafygreen-ui/hooks";
import { createSyntheticEvent } from "@leafygreen-ui/lib";
import TextInput from "@leafygreen-ui/text-input";
import { useLogWindowAnalytics } from "analytics";
import { CharKey } from "constants/keys";
import { size } from "constants/tokens";
import { leaveBreadcrumb } from "utils/errorReporting";

type AutocompleteProps = {
  autocompleteSuggestions: string[];
  icon?: React.ReactElement;
} & React.ComponentProps<typeof TextInput>;

const Autocomplete: React.FC<AutocompleteProps> = forwardRef((props, ref) => {
  const {
    autocompleteSuggestions,
    icon,
    value: valueProp,
    onChange: onChangeProp,
    onKeyDown,
    ...rest
  } = props;

  const { sendEvent } = useLogWindowAnalytics();
  const [suggestion, setSuggestion] = useState("");
  const inputRef = useForwardedRef(ref, null);

  const isControlled = valueProp !== undefined;
  const { value, handleChange } = useControlledValue(valueProp, onChangeProp);

  const changeInputValue = useCallback(
    (newVal: string) => {
      if (inputRef.current) {
        inputRef.current.value = newVal;
        handleChange(
          createSyntheticEvent(
            new Event("change", { cancelable: true, bubbles: true }),
            inputRef.current
          )
        );
      }
    },
    [handleChange, inputRef]
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (suggestion) {
      if (e.key === CharKey.Tab || e.key === CharKey.ArrowRight) {
        e.preventDefault();
        sendEvent({ name: "Applied Search Suggestion", suggestion });
        leaveBreadcrumb("applied-search-suggestion", { suggestion }, "user");
        changeInputValue(suggestion);
        setSuggestion("");
      } else if (e.key === CharKey.Enter) {
        setSuggestion("");
      }
    }
    onKeyDown?.(e);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleChange?.(e);
  };

  useEffect(() => {
    if (value !== "") {
      const activeOption =
        autocompleteSuggestions.find(
          (o) => o !== value && o.startsWith(value)
        ) ?? "";
      setSuggestion(activeOption);
    }
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AutocompleteWrapper>
      <Container>
        <SuggestionInput
          aria-labelledby="autocomplete-suggestion"
          data-cy="autocomplete-suggestion"
          placeholder={suggestion}
          value=""
        />
        <ActiveInput
          {...rest}
          ref={inputRef}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          value={isControlled ? valueProp : value}
        />
      </Container>
      {icon && <IconWrapper>{icon}</IconWrapper>}
    </AutocompleteWrapper>
  );
});

Autocomplete.displayName = "Autocomplete";

const AutocompleteWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Container = styled.div`
  display: grid;
`;

const SuggestionInput = styled(TextInput)`
  grid-column: 1;
  grid-row: 1;
  div input {
    pointer-events: none;
    border: 1px solid transparent;
  }
`;

const ActiveInput = styled(TextInput)`
  grid-column: 1;
  grid-row: 1;
  div input {
    background: transparent;
  }
`;

const IconWrapper = styled.div`
  align-items: center;
  display: flex;
  bottom: 0;
  height: 36px; /* height of LG text-input */
  position: absolute;
  right: ${size.xxs};
  width: ${size.l};
  justify-content: center;
`;

export default Autocomplete;
