import { useState } from "react";
import styled from "@emotion/styled";
import Badge, { Variant } from "@leafygreen-ui/badge";
import IconButton from "@leafygreen-ui/icon-button";
import { palette } from "@leafygreen-ui/palette";
import { SideNav, SideNavGroup } from "@leafygreen-ui/side-nav";
import { Body, Overline } from "@leafygreen-ui/typography";
import Cookie from "js-cookie";
import Icon from "components/Icon";
import { HAS_OPENED_DRAWER } from "constants/cookies";
import { CaseSensitivity, MatchType } from "constants/enums";
import { size, zIndex } from "constants/tokens";
import { useFilterParam } from "hooks/useFilterParam";
import { ExpandedLines, Filter } from "types/logs";
import { leaveBreadcrumb } from "utils/errorReporting";
import FilterGroup from "./FilterGroup";

const { green, gray } = palette;

interface FiltersDrawerProps {
  ["data-cy"]?: string;
  expandedLines: ExpandedLines;
  collapseLines: (idx: number) => void;
  clearExpandedLines: () => void;
}

const FiltersDrawer: React.FC<FiltersDrawerProps> = ({
  "data-cy": dataCy,
  expandedLines,
  collapseLines,
  clearExpandedLines,
}) => {
  const [collapsed, setCollapsed] = useState(
    Cookie.get(HAS_OPENED_DRAWER) === "true"
  );

  const [filters, setFilters] = useFilterParam();

  const deleteFilter = (filterName: string) => {
    const newFilters = filters.filter((f) => f.name !== filterName);
    setFilters(newFilters);

    if (newFilters.length === 0) {
      clearExpandedLines();
    }
    leaveBreadcrumb("delete-filter", { filterName }, "user");
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
  };

  return (
    <StyledSideNav
      aria-label="Filters side nav"
      collapsed={collapsed}
      data-cy={dataCy}
      setCollapsed={(collapse) => {
        setCollapsed(collapse);
        Cookie.set(HAS_OPENED_DRAWER, "true", { expires: 365 });
      }}
      widthOverride={270}
    >
      <PaddedContainer>
        <StyledSideNavGroup
          glyph={
            <Icon
              fill={filters.length ? green.dark2 : gray.base}
              glyph="Filter"
            />
          }
          header={
            <NavGroupHeader data-cy="filters-nav-group-header">
              <NavGroupTitle>Filters</NavGroupTitle>
              <Badge variant={Variant.Green}>{filters.length}</Badge>
            </NavGroupHeader>
          }
        >
          {filters.length ? (
            filters.map((filter) => (
              <FilterWrapper
                key={filter.name}
                data-cy={`filter-${filter.name}`}
              >
                <FilterGroup
                  deleteFilter={deleteFilter}
                  editFilter={editFilter}
                  filter={filter}
                />
              </FilterWrapper>
            ))
          ) : (
            <FilterWrapper data-cy="no-filters-message">
              <Body>No filters have been applied.</Body>
            </FilterWrapper>
          )}
        </StyledSideNavGroup>

        <StyledSideNavGroup
          glyph={
            <Icon
              fill={expandedLines.length ? green.dark2 : gray.base}
              glyph="Expand"
            />
          }
          header={
            <NavGroupHeader data-cy="expanded-lines-nav-group-header">
              <NavGroupTitle>Expanded Lines</NavGroupTitle>
              <Badge variant={Variant.Green}>{expandedLines.length}</Badge>
            </NavGroupHeader>
          }
        >
          {expandedLines.length ? (
            expandedLines.map((e, idx) => (
              <ExpandedLineWrapper
                key={`expanded-row-${e[0]}-to-${e[1]}`}
                data-cy={`expanded-row-${e[0]}-to-${e[1]}`}
              >
                <IconButton
                  aria-label="Delete range"
                  onClick={() => collapseLines(idx)}
                >
                  <Icon fill={green.dark2} glyph="X" />
                </IconButton>
                <Overline>
                  Row {e[0]} to {e[1]}
                </Overline>
              </ExpandedLineWrapper>
            ))
          ) : (
            <ExpandedLineWrapper data-cy="no-expanded-lines-message">
              <Body>No lines have been expanded.</Body>
            </ExpandedLineWrapper>
          )}
        </StyledSideNavGroup>
      </PaddedContainer>
    </StyledSideNav>
  );
};

const StyledSideNav = styled(SideNav)`
  z-index: ${zIndex.drawer};
  box-shadow: 0 ${size.xxs} ${size.xxs} rgba(0, 0, 0, 0.25);
`;

const PaddedContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 ${size.xs};
`;

// @ts-expect-error
const StyledSideNavGroup = styled(SideNavGroup)`
  > div {
    padding: 0;
  }
`;

const NavGroupHeader = styled.div`
  display: flex;
  align-items: center;
`;

const NavGroupTitle = styled.div`
  margin-right: ${size.xxs};
`;

const FilterWrapper = styled.div`
  margin-top: ${size.xs};
  margin-bottom: ${size.m};
`;

const ExpandedLineWrapper = styled.div`
  display: flex;
  align-items: center;
  padding-top: ${size.xxs};
`;

export default FiltersDrawer;
