import { PropsWithChildren, ReactNode } from "react";
import styled from "@emotion/styled";
import Badge, { Variant } from "@leafygreen-ui/badge";
import { palette } from "@leafygreen-ui/palette";
import { SideNavGroup } from "@leafygreen-ui/side-nav";
import { Body } from "@leafygreen-ui/typography";
import Icon, { glyphs } from "components/Icon";
import { size } from "constants/tokens";

const { green } = palette;

interface BaseNavGroupProps<T> {
  ["data-cy"]: string;
  children: ReactNode;
  glyph: keyof typeof glyphs;
  items: T[];
  navGroupTitle: string;
  defaultMessage: string;
  additionalHeaderText?: ReactNode;
}

const BaseNavGroup = <T extends {}>({
  "data-cy": dataCy,
  children,
  glyph,
  items,
  navGroupTitle,
  defaultMessage,
  additionalHeaderText,
}: PropsWithChildren<BaseNavGroupProps<T>>) => (
  <StyledSideNavGroup
    glyph={<Icon fill={green.dark2} glyph={glyph} />}
    hasActiveItem={items.length > 0}
    header={
      <NavGroupHeader data-cy={`${dataCy}-nav-group-header`}>
        <NavGroupTitle>{navGroupTitle}</NavGroupTitle>
        <Badge variant={Variant.Green}>{items.length}</Badge>
        {additionalHeaderText}
      </NavGroupHeader>
    }
  >
    {items.length ? (
      children
    ) : (
      <DefaultMessageWrapper data-cy={`${dataCy}-default-message`}>
        <Body>{defaultMessage}</Body>
      </DefaultMessageWrapper>
    )}
  </StyledSideNavGroup>
);

// @ts-expect-error
const StyledSideNavGroup = styled(SideNavGroup)`
  > div {
    padding: 0;
  }
`;

const NavGroupHeader = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const NavGroupTitle = styled.div`
  margin-right: ${size.xxs};
`;

const DefaultMessageWrapper = styled.div`
  margin-top: ${size.xs};
  margin-bottom: ${size.s};
`;

export default BaseNavGroup;
