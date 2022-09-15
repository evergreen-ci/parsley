import { useState } from "react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import Toggle from "@leafygreen-ui/toggle";
import { Disclaimer } from "@leafygreen-ui/typography";
import Cookie from "js-cookie";
import { PRETTY_PRINT_BOOKMARKS } from "constants/cookies";
import { QueryParams } from "constants/queryParams";
import { size } from "constants/tokens";
import { useQueryParam } from "hooks/useQueryParam";
import { FilterRow, StyledSubtitle } from "../styles";

const { gray } = palette;

interface BaseToggleProps {
  ["data-cy"]?: string;
  leftLabel?: string;
  rightLabel?: string;
  label: string;
  value: boolean;
  onChange: (checked: boolean) => void;
}

const BaseToggle: React.FC<BaseToggleProps> = ({
  "data-cy": dataCy,
  rightLabel = "ON",
  leftLabel = "OFF",
  label,
  value,
  onChange,
}) => (
  <FilterRow>
    <StyledSubtitle>{label}</StyledSubtitle>
    <ToggleWithLabel>
      <StyledDisclaimer>{leftLabel}</StyledDisclaimer>
      <Toggle
        aria-labelledby="base-toggle"
        checked={value}
        data-cy={dataCy}
        onChange={onChange}
        size="small"
      />
      <StyledDisclaimer>{rightLabel}</StyledDisclaimer>
    </ToggleWithLabel>
  </FilterRow>
);

export const WrapToggle: React.FC = () => {
  const [wrap, setWrap] = useQueryParam(QueryParams.Wrap, false);
  return (
    <BaseToggle
      data-cy="wrap-toggle"
      label="Wrap"
      onChange={setWrap}
      value={wrap}
    />
  );
};

export const CaseSensitiveToggle: React.FC = () => {
  const [caseSensitive, setCaseSensitive] = useQueryParam(
    QueryParams.CaseSensitive,
    false
  );
  return (
    <BaseToggle
      data-cy="case-sensitive-toggle"
      label="Case Sensitive"
      onChange={setCaseSensitive}
      value={caseSensitive}
    />
  );
};

export const FilterLogicToggle: React.FC = () => {
  const [filterLogic, setFilterLogic] = useQueryParam(
    QueryParams.FilterLogic,
    "and"
  );
  const isActive = filterLogic !== "and";

  const onChange = (checked: boolean) => {
    if (checked) {
      setFilterLogic("or");
    } else {
      setFilterLogic("and");
    }
  };

  return (
    <BaseToggle
      data-cy="filter-logic-toggle"
      label="Filter Logic"
      leftLabel="AND"
      onChange={onChange}
      rightLabel="OR"
      value={isActive}
    />
  );
};

export const ExpandableRowsToggle: React.FC = () => {
  const [expandableRows, setExpandableRows] = useQueryParam(
    QueryParams.Expandable,
    false
  );
  return (
    <BaseToggle
      data-cy="expandable-rows-toggle"
      label="Expandable Rows"
      onChange={setExpandableRows}
      value={expandableRows}
    />
  );
};

export const PrettyPrintToggle: React.FC = () => {
  const [prettyPrint, setPrettyPrint] = useState(
    Cookie.get(PRETTY_PRINT_BOOKMARKS) === "true"
  );
  const onChange = (checked: boolean) => {
    setPrettyPrint(checked);
    Cookie.set(PRETTY_PRINT_BOOKMARKS, checked.toString(), { expires: 365 });
  };

  return (
    <BaseToggle
      data-cy="pretty-print-toggle"
      label="Pretty Print Bookmarks"
      onChange={onChange}
      value={prettyPrint}
    />
  );
};

// @ts-ignore-error
const StyledDisclaimer = styled(Disclaimer)`
  color: ${gray.base};
  margin: 0 ${size.xxs};
`;

const ToggleWithLabel = styled.div`
  display: flex;
  align-items: center;
`;
