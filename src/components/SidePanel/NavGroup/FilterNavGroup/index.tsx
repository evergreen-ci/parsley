import styled from "@emotion/styled";
import { useLogWindowAnalytics } from "analytics";
import { CaseSensitivity, MatchType } from "constants/enums";
import { size } from "constants/tokens";
import { useFilterParam } from "hooks/useFilterParam";
import { Filter } from "types/logs";
import { leaveBreadcrumb } from "utils/errorReporting";
import BaseNavGroup from "../BaseNavGroup";
import FilterGroup from "./FilterGroup";

interface FilterNavGroupProps {
  clearExpandedLines: () => void;
}

const FilterNavGroup: React.FC<FilterNavGroupProps> = ({
  clearExpandedLines,
}) => {
  const [filters, setFilters] = useFilterParam();
  const { sendEvent } = useLogWindowAnalytics();

  const deleteFilter = (filterName: string) => {
    const newFilters = filters.filter((f) => f.name !== filterName);
    setFilters(newFilters);
    if (newFilters.length === 0) {
      clearExpandedLines();
    }
    leaveBreadcrumb("delete-filter", { filterName }, "user");
    sendEvent({ name: "Deleted Filter", filterExpression: filterName });
  };

  const editFilter = (
    fieldName: keyof Filter,
    fieldValue: MatchType | CaseSensitivity | boolean | string,
    filter: Filter
  ) => {
    // Duplicate filters are not allowed.
    if (fieldName === "name" && filters.some((f) => f.name === fieldValue)) {
      return;
    }
    const newFilters = [...filters];
    const idxToReplace = newFilters.findIndex((f) => f.name === filter.name);
    newFilters[idxToReplace] = {
      ...filter,
      [fieldName]: fieldValue,
    };
    setFilters(newFilters);
    leaveBreadcrumb(
      "edit-filter",
      { filterName: filter.name, fieldName, fieldValue },
      "user"
    );
    sendEvent({
      name: "Edited Filter",
      before: filter,
      after: newFilters[idxToReplace],
    });
  };

  return (
    <BaseNavGroup
      data-cy="filters"
      defaultMessage="No filters have been applied."
      glyph="Filter"
      items={filters}
      navGroupTitle="Filters"
    >
      {filters.map((filter) => (
        <FilterWrapper key={filter.name} data-cy={`filter-${filter.name}`}>
          <FilterGroup
            deleteFilter={deleteFilter}
            editFilter={editFilter}
            filter={filter}
          />
        </FilterWrapper>
      ))}
    </BaseNavGroup>
  );
};

const FilterWrapper = styled.div`
  margin-top: ${size.s};
  margin-bottom: ${size.xxs};
`;

export default FilterNavGroup;
