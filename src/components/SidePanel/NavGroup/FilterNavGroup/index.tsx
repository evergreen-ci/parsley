import { useState } from "react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { useLogWindowAnalytics } from "analytics";
import ApplyFiltersModal from "components/ApplyFiltersModal";
import { CaseSensitivity, MatchType } from "constants/enums";
import { size } from "constants/tokens";
import { useFilterParam } from "hooks/useFilterParam";
import { Filter } from "types/logs";
import { isProduction } from "utils/environmentVariables";
import { leaveBreadcrumb } from "utils/errorReporting";
import FilterGroup from "./FilterGroup";
import BaseNavGroup from "../BaseNavGroup";

const { green } = palette;

interface FilterNavGroupProps {
  clearExpandedLines: () => void;
}

const FilterNavGroup: React.FC<FilterNavGroupProps> = ({
  clearExpandedLines,
}) => {
  const { sendEvent } = useLogWindowAnalytics();

  const [filters, setFilters] = useFilterParam();
  const [open, setOpen] = useState(false);

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
    <>
      <ApplyFiltersModal open={open} setOpen={setOpen} />
      <BaseNavGroup
        additionalHeaderText={
          // TODO: Unhide in EVG-19897.
          isProduction ? null : (
            <ModalTrigger
              onClick={() => setOpen(true)}
              role="button"
              tabIndex={0}
            >
              View project filters
            </ModalTrigger>
          )
        }
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
    </>
  );
};

const ModalTrigger = styled.div`
  text-decoration: underline;
  text-transform: none;
  letter-spacing: 0;
  font-weight: normal;
  color: ${green.dark2};
  position: absolute;
  right: 0;
  :hover {
    cursor: pointer;
  }
`;

const FilterWrapper = styled.div`
  margin-top: ${size.s};
  margin-bottom: ${size.xxs};
`;

export default FilterNavGroup;
