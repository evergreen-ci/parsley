import { useState } from "react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { useLogWindowAnalytics } from "analytics";
import ProjectFiltersModal from "components/ProjectFiltersModal";
import { CaseSensitivity, MatchType } from "constants/enums";
import { size } from "constants/tokens";
import { useFilterParam } from "hooks/useFilterParam";
import { Filter } from "types/logs";
import { SentryBreadcrumb, leaveBreadcrumb } from "utils/errorReporting";
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

  const deleteFilter = (filterExpression: string) => {
    const newFilters = filters.filter((f) => f.expression !== filterExpression);
    setFilters(newFilters);
    if (newFilters.length === 0) {
      clearExpandedLines();
    }
    leaveBreadcrumb(
      "delete-filter",
      { filterExpression },
      SentryBreadcrumb.User,
    );
    sendEvent({ filterExpression, name: "Deleted Filter" });
  };

  const editFilter = (
    fieldName: keyof Filter,
    fieldValue: MatchType | CaseSensitivity | boolean | string,
    filter: Filter,
  ) => {
    // Duplicate filters are not allowed.
    if (
      fieldName === "expression" &&
      filters.some((f) => f.expression === fieldValue)
    ) {
      return;
    }
    const newFilters = [...filters];
    const idxToReplace = newFilters.findIndex(
      (f) => f.expression === filter.expression,
    );
    newFilters[idxToReplace] = {
      ...filter,
      [fieldName]: fieldValue,
    };
    setFilters(newFilters);
    leaveBreadcrumb(
      "edit-filter",
      { fieldName, fieldValue, filterExpression: filter.expression },
      SentryBreadcrumb.User,
    );
    sendEvent({
      after: newFilters[idxToReplace],
      before: filter,
      name: "Edited Filter",
    });
  };

  return (
    <>
      <ProjectFiltersModal open={open} setOpen={setOpen} />
      <BaseNavGroup
        additionalHeaderText={
          <ModalTrigger
            onClick={() => setOpen(true)}
            role="button"
            tabIndex={0}
          >
            View project filters
          </ModalTrigger>
        }
        data-cy="filters"
        defaultMessage="No filters have been applied."
        glyph="Filter"
        items={filters}
        navGroupTitle="Filters"
      >
        {filters.map((filter) => (
          <FilterWrapper
            key={filter.expression}
            data-cy={`filter-${filter.expression}`}
          >
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
  margin-bottom: ${size.xs};
`;

export default FilterNavGroup;
