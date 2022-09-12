import { useState } from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { palette } from "@leafygreen-ui/palette";
import TextInput from "@leafygreen-ui/text-input";
import Toggle from "@leafygreen-ui/toggle";
import { Disclaimer, Subtitle } from "@leafygreen-ui/typography";
import Cookie from "js-cookie";
import Icon from "components/Icon";
import { FORMAT_LOG_V2, PRETTY_PRINT_BOOKMARKS } from "constants/cookies";
import { size } from "constants/tokens";
import { useQueryParam } from "hooks/useQueryParam";

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
    <StyledSubtitle> {label} </StyledSubtitle>
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
  const [wrap, setWrap] = useQueryParam("wrap", false);
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
    "caseSensitive",
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

export const LogV2Toggle: React.FC = () => {
  const [logV2, setLogV2] = useState(Cookie.get(FORMAT_LOG_V2) === "true");
  const onChange = (checked: boolean) => {
    setLogV2(checked);
    Cookie.set(FORMAT_LOG_V2, checked.toString(), { expires: 365 });
  };

  return (
    <BaseToggle
      data-cy="format-v2-toggle"
      label="Format LogV2"
      onChange={onChange}
      value={logV2}
    />
  );
};

export const FilterLogicToggle: React.FC = () => {
  const [filterLogic, setFilterLogic] = useQueryParam("filterLogic", "and");

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
      value={filterLogic !== "and"}
    />
  );
};

export const ExpandableRowsToggle: React.FC = () => {
  const [expandableRows, setExpandableRows] = useQueryParam(
    "expandable",
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

export const SearchRange: React.FC = () => {
  const [lowerBound, setLowerQueryParam] = useQueryParam<number | undefined>(
    "lower",
    undefined
  );
  const [upperBound, setUpperBound] = useQueryParam<number | undefined>(
    "upper",
    undefined
  );

  const updateLowerBound = (newVal: string) => {
    if (newVal === "") {
      setLowerQueryParam(undefined);
    } else {
      setLowerQueryParam(parseInt(newVal, 10));
    }
  };

  const updateUpperBound = (newVal: string) => {
    if (newVal === "") {
      setUpperBound(undefined);
    } else {
      setUpperBound(parseInt(newVal, 10));
    }
  };

  return (
    <FilterRow>
      <StyledSubtitle> Range </StyledSubtitle>
      <RangeContainer>
        <RangeInput
          aria-labelledby="Range Lower Bound"
          data-cy="range-lower-bound"
          min={0}
          onChange={(e) => updateLowerBound(e.target.value)}
          placeholder="0"
          sizeVariant="small"
          type="number"
          value={(lowerBound ?? "").toString()}
        />
        <RangeInput
          aria-labelledby="Range Upper Bound"
          data-cy="range-upper-bound"
          min={-1}
          onChange={(e) => updateUpperBound(e.target.value)}
          placeholder="-1"
          sizeVariant="small"
          type="number"
          value={(upperBound ?? "").toString()}
        />
      </RangeContainer>
    </FilterRow>
  );
};

export const ButtonRow: React.FC = () => (
  <FilterRow>
    <Button leftGlyph={<Icon glyph="Copy" />}> JIRA </Button>
    <Button leftGlyph={<Icon glyph="Export" />}> RAW </Button>
    <Button leftGlyph={<Icon glyph="Export" />}> HTML </Button>
  </FilterRow>
);

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${size.m};
`;

// @ts-ignore-error
const StyledSubtitle = styled(Subtitle as div)`
  font-size: 16px;
`;

// @ts-ignore-error
const StyledDisclaimer = styled(Disclaimer)`
  color: ${gray.base};
  margin: 0 ${size.xxs};
`;

const ToggleWithLabel = styled.div`
  display: flex;
  align-items: center;
`;

const RangeContainer = styled.div`
  display: flex;
`;

const RangeInput = styled(TextInput)`
  width: ${size.xxl};
  margin-left: ${size.xs};
`;
