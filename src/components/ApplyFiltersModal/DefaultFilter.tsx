import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import Checkbox from "@leafygreen-ui/checkbox";
import Tooltip from "@leafygreen-ui/tooltip";
import Icon from "components/Icon";
import { size } from "constants/tokens";
import { ParsleyFilter } from "gql/generated/types";
import { Filter } from "types/logs";

interface DefaultFilterProps {
  filter: ParsleyFilter;
  urlFilters: Filter[];
}

const DefaultFilter: React.FC<DefaultFilterProps> = ({
  filter,
  urlFilters,
}) => {
  const alreadyActive = !!urlFilters.find((f) => f.name === filter.expression);

  return (
    <DefaultFilterContainer data-cy="default-filter">
      <Checkbox
        checked={alreadyActive}
        disabled={alreadyActive}
        label={
          <>
            {filter.expression}
            {alreadyActive && (
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
