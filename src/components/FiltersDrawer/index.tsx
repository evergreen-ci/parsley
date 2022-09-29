import { useState } from "react";
import styled from "@emotion/styled";
import Badge, { Variant } from "@leafygreen-ui/badge";
import { palette } from "@leafygreen-ui/palette";
import { SideNav, SideNavGroup } from "@leafygreen-ui/side-nav";
import { Body } from "@leafygreen-ui/typography";
import Cookie from "js-cookie";
import Icon from "components/Icon";
import { HAS_OPENED_DRAWER } from "constants/cookies";
import { QueryParams } from "constants/queryParams";
import { size, zIndex } from "constants/tokens";
import { useQueryParam } from "hooks/useQueryParam";
import Filter from "./Filter";

const { green, gray } = palette;

interface FiltersDrawerProps {
  ["data-cy"]?: string;
}

const FiltersDrawer: React.FC<FiltersDrawerProps> = ({ "data-cy": dataCy }) => {
  const [collapsed, setCollapsed] = useState(
    Cookie.get(HAS_OPENED_DRAWER) === "true"
  );

  const [filters, setFilters] = useQueryParam<string[]>(
    QueryParams.Filters,
    []
  );

  const deleteFilter = (filterName: string) => {
    const newFilters = filters.filter((f) => f !== filterName);
    setFilters(newFilters);
  };

  const editFilter = (oldFilter: string, newFilter: string) => {
    // Duplicate filters are not allowed.
    if (filters.includes(newFilter)) {
      return;
    }
    const newFilters = [...filters];
    const idxToReplace = newFilters.indexOf(oldFilter);
    newFilters[idxToReplace] = newFilter;
    setFilters(newFilters);
  };

  return (
    <StyledSideNav
      aria-label="Filters Side Nav"
      collapsed={collapsed}
      data-cy={dataCy}
      setCollapsed={(collapse: React.SetStateAction<boolean>) => {
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
            <NavGroupHeader data-cy="nav-group-header">
              <NavGroupTitle>Filters</NavGroupTitle>
              <Badge variant={Variant.Green}>{filters.length}</Badge>
            </NavGroupHeader>
          }
        >
          {filters.length ? (
            filters.map((filter) => (
              <FilterWrapper key={filter}>
                <Filter
                  deleteFilter={deleteFilter}
                  editFilter={editFilter}
                  filterName={filter}
                />
              </FilterWrapper>
            ))
          ) : (
            <FilterWrapper data-cy="no-filters-message">
              <Body>No filters have been applied.</Body>
            </FilterWrapper>
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

export default FiltersDrawer;
