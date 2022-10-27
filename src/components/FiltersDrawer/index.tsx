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
import { QueryParams } from "constants/queryParams";
import { size, zIndex } from "constants/tokens";
import { useQueryParam } from "hooks/useQueryParam";
import { ExpandedLines } from "types/logs";
import { leaveBreadcrumb } from "utils/errorReporting";
import Filter from "./Filter";

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

  const [filters, setFilters] = useQueryParam<string[]>(
    QueryParams.Filters,
    []
  );

  const [highlights, setHighlights] = useQueryParam<string[]>(
    QueryParams.Highlights,
    []
  );

  const deleteFilter = (filterName: string) => {
    const newFilters = filters.filter((f) => f !== filterName);
    setFilters(newFilters);

    if (newFilters.length === 0) {
      clearExpandedLines();
    }
    leaveBreadcrumb("delete-filter", { filterName }, "user");
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
    leaveBreadcrumb("edit-filter", { oldFilter, newFilter }, "user");
  };

  const deleteHighlight = (highlightName: string) => {
    const newHighlights = highlights.filter((f) => f !== highlightName);
    setHighlights(newHighlights);
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
          glyph={<SideNavIcon active={filters.length > 0} glyph="Filter" />}
          header={
            <NavGroupHeader data-cy="filters-nav-group-header">
              <NavGroupTitle>Filters</NavGroupTitle>
              <Badge variant={Variant.Green}>{filters.length}</Badge>
            </NavGroupHeader>
          }
        >
          {filters.length ? (
            filters.map((filter) => (
              <SectionWrapper key={filter}>
                <Filter
                  deleteFilter={deleteFilter}
                  editFilter={editFilter}
                  filterName={filter}
                />
              </SectionWrapper>
            ))
          ) : (
            <SectionWrapper data-cy="no-filters-message">
              <Body>No filters have been applied.</Body>
            </SectionWrapper>
          )}
        </StyledSideNavGroup>

        <StyledSideNavGroup
          glyph={
            <SideNavIcon active={expandedLines.length > 0} glyph="Expand" />
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
              <NonFilterElement key={`range-${e[0]}-to-${e[1]}`}>
                <IconButton
                  aria-label="Delete range button"
                  onClick={() => collapseLines(idx)}
                >
                  <Icon fill={green.dark2} glyph="X" />
                </IconButton>
                <Overline>
                  Row {e[0]} to {e[1]}
                </Overline>
              </NonFilterElement>
            ))
          ) : (
            <SectionWrapper data-cy="no-expanded-lines-message">
              <Body>No lines have been expanded.</Body>
            </SectionWrapper>
          )}
        </StyledSideNavGroup>

        <StyledSideNavGroup
          glyph={<SideNavIcon active={highlights.length > 0} glyph="Minus" />}
          header={
            <NavGroupHeader data-cy="highlight-nav-group-header">
              <NavGroupTitle>Highlighted Terms</NavGroupTitle>
              <Badge variant={Variant.Green}>{highlights.length}</Badge>
            </NavGroupHeader>
          }
        >
          {highlights.length ? (
            <>
              {highlights.map((highlight) => (
                <NonFilterElement key={`highlight-${highlight}`}>
                  <IconButton
                    aria-label="Delete highlight"
                    data-cy="delete-highlight-button"
                    onClick={() => deleteHighlight(highlight)}
                  >
                    <Icon fill={green.dark2} glyph="X" />
                  </IconButton>
                  <Overline>{highlight}</Overline>
                </NonFilterElement>
              ))}
            </>
          ) : (
            <SectionWrapper data-cy="no-highlight-message">
              <Body>No terms have been highlighted.</Body>
            </SectionWrapper>
          )}
        </StyledSideNavGroup>
      </PaddedContainer>
    </StyledSideNav>
  );
};
interface SideNavIconProps extends React.ComponentProps<typeof Icon> {
  active: boolean;
}

const SideNavIcon: React.FC<SideNavIconProps> = ({ active, ...rest }) => (
  <Icon {...rest} fill={active ? green.dark2 : gray.base} />
);
// Leafygreen's SideNav requires this element to have an Icon displayName
SideNavIcon.displayName = "Icon";

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

const SectionWrapper = styled.div`
  margin-top: ${size.xs};
  margin-bottom: ${size.m};
`;

const NonFilterElement = styled.div`
  display: flex;
  align-items: center;
  margin: ${size.xs} 0;
`;

export default FiltersDrawer;
