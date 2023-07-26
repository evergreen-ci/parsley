import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import Checkbox from "@leafygreen-ui/checkbox";
import Tooltip from "@leafygreen-ui/tooltip";
import Icon from "components/Icon";
import { CaseSensitivity, MatchType } from "constants/enums";
import { size } from "constants/tokens";
import { ParsleyFilter } from "gql/generated/types";
import { Filter } from "types/logs";

interface ProjectFilterProps {
  addFilter: (filterToAdd: Filter) => void;
  removeFilter: (filterToRemove: string) => void;
  active: boolean;
  selected: boolean;
  filter: ParsleyFilter;
}

const ProjectFilter: React.FC<ProjectFilterProps> = ({
  active,
  addFilter,
  filter,
  removeFilter,
  selected,
}) => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      addFilter({
        caseSensitive: filter.caseSensitive
          ? CaseSensitivity.Sensitive
          : CaseSensitivity.Insensitive,
        matchType: filter.exactMatch ? MatchType.Exact : MatchType.Inverse,
        name: filter.expression,
        visible: true,
      });
    } else {
      removeFilter(filter.expression);
    }
  };

  return (
    <ProjectFilterContainer data-cy="project-filter">
      <Checkbox
        checked={active || selected}
        disabled={active}
        label={
          <>
            {filter.expression}
            {active && (
              <Tooltip
                data-cy="project-filter-tooltip"
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
    </ProjectFilterContainer>
  );
};

const ProjectFilterContainer = styled.div`
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

export default ProjectFilter;
