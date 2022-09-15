import { useState } from "react";
import Cookie from "js-cookie";
import { PRETTY_PRINT_BOOKMARKS } from "constants/cookies";
import { QueryParams } from "constants/queryParams";
import { useQueryParam } from "hooks/useQueryParam";
import BaseToggle from "./BaseToggle";

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
