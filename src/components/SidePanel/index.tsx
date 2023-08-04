import { useState } from "react";
import styled from "@emotion/styled";
import { SideNav } from "@leafygreen-ui/side-nav";
import Cookie from "js-cookie";
import { HAS_OPENED_DRAWER } from "constants/cookies";
import { size, zIndex } from "constants/tokens";
import { ExpandedLines } from "types/logs";
import {
  ExpandedNavGroup,
  FilterNavGroup,
  HighlightNavGroup,
} from "./NavGroup";

interface SidePanelProps {
  ["data-cy"]?: string;
  expandedLines: ExpandedLines;
  collapseLines: (idx: number) => void;
  clearExpandedLines: () => void;
}

const SidePanel: React.FC<SidePanelProps> = ({
  clearExpandedLines,
  collapseLines,
  "data-cy": dataCy,
  expandedLines,
}) => {
  const [collapsed, setCollapsed] = useState(
    Cookie.get(HAS_OPENED_DRAWER) === "true"
  );

  return (
    <StyledSideNav
      aria-label="Side panel"
      collapsed={collapsed}
      data-cy={dataCy}
      setCollapsed={(collapse) => {
        setCollapsed(collapse);
        Cookie.set(HAS_OPENED_DRAWER, "true", { expires: 365 });
      }}
      widthOverride={290}
    >
      <PaddedContainer>
        <FilterNavGroup clearExpandedLines={clearExpandedLines} />
        <ExpandedNavGroup
          collapseLines={collapseLines}
          expandedLines={expandedLines}
        />
        <HighlightNavGroup />
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
  gap: ${size.xs};
  padding: 0 ${size.xs};
`;

export default SidePanel;
