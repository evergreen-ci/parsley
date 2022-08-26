import { KeyboardEvent, useState } from "react";
import styled from "@emotion/styled";
import { Option, Select } from "@leafygreen-ui/select";
import TextInput from "@leafygreen-ui/text-input";

interface SearchBarProps {
  disabled?: boolean;
}

// Basic component to test LG and Emotion integration.
const SearchBar: React.FC<SearchBarProps> = ({ disabled = false }) => {
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState("search");

  const handleOnSubmit = () => {
    setInput("");
  };

  return (
    <Container>
      <StyledSelect
        allowDeselect={false}
        aria-labelledby="searchbar-select"
        data-cy="searchbar-select"
        disabled={disabled}
        onChange={(v) => setSelected(v)}
        value={selected}
      >
        <Option key="search" value="search">
          Search
        </Option>
        <Option key="filter" value="filter">
          Filter
        </Option>
      </StyledSelect>
      <StyledInput
        aria-label="searchbar-input"
        data-cy="searchbar-input"
        disabled={disabled}
        onChange={(e) => setInput(e.target.value)}
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
  }
`;

const StyledInput = styled(TextInput)`
  width: 40vw;
  /* Remove default padding around the text input. */
  > div {
    padding: 0;
  }
  /* overwrite lg borders https://jira.mongodb.org/browse/PD-1995 */
  div input {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
`;

export default SearchBar;
