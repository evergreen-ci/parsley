import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import Checkbox from "@leafygreen-ui/checkbox";
import Tooltip from "@leafygreen-ui/tooltip";
import Icon from "components/Icon";
import { CaseSensitivity, MatchType } from "constants/enums";
import { size } from "constants/tokens";
import { ParsleyFilter } from "gql/generated/types";
import { Filter } from "types/logs";

interface DefaultFilterProps {
  addFilter: (filterToAdd: Filter) => void;
  removeFilter: (filterToRemove: string) => void;
  activeFilters: Filter[];
  selectedFilters: Filter[];
  filter: ParsleyFilter;
}

const DefaultFilter: React.FC<DefaultFilterProps> = ({
  addFilter,
  removeFilter,
  activeFilters,
  selectedFilters,
  filter,
}) => {
  const active = !!activeFilters.find((f) => f.name === filter.expression);
  const selected = !!selectedFilters.find((f) => f.name === filter.expression);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      addFilter({
        name: filter.expression,
        visible: true,
        caseSensitive: filter.caseSensitive
          ? CaseSensitivity.Sensitive
          : CaseSensitivity.Insensitive,
        matchType: filter.exactMatch ? MatchType.Exact : MatchType.Inverse,
      });
    } else {
      removeFilter(filter.expression);
    }
  };

  return (
    <DefaultFilterContainer data-cy="default-filter">
      <Checkbox
        checked={active || selected}
        disabled={active}
        label={
          <>
            {filter.expression}
            {active && (
              <Tooltip
                data-cy="default-filter-tooltip"
                trigger={
                  <IconContainer>
                    <Icon glyph="InfoWithCircle" />
                  </IconContainer>
                }
                triggerEvent="hover"
              >
                This filter is already active.
              </Tooltip>
            )}
          </>
        }
        name={filter.expression}
        onChange={onChange}
      />
      <BadgeContainer>
        <Badge variant="darkgray">
          {filter.caseSensitive ? "Sensitive" : "Insensitive"}
        </Badge>
        <Badge variant="darkgray">
          {filter.exactMatch ? "Exact" : "Inverse"}
        </Badge>
      </BadgeContainer>
    </DefaultFilterContainer>
  );
};

const DefaultFilterContainer = styled.div`
  margin-top: ${size.s};
`;

const IconContainer = styled.span`
  margin-left: ${size.xxs};
  svg {
    vertical-align: text-top;
  }
`;

const BadgeContainer = styled.div`
  display: flex;
  gap: ${size.xxs};
  margin: ${size.xxs} 0;
  margin-left: ${size.m};
`;

export default DefaultFilter;
