import { Fragment } from "react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import Tooltip from "@leafygreen-ui/tooltip";
import Icon from "components/Icon";
import { StyledLink, StyledRouterLink } from "components/styles";
import { size } from "constants/tokens";
import { trimStringFromMiddle } from "utils/string";

const { gray } = palette;

export interface Breadcrumb {
  text: string;
  to?: string;
  href?: string;
  onClick?: () => void;
  "data-cy"?: string;
}
interface BreadcrumbsProps {
  breadcrumbs: Breadcrumb[];
}
const Breadcrumbs: React.VFC<BreadcrumbsProps> = ({ breadcrumbs }) => (
  <Container data-cy="breadcrumb-container">
    {breadcrumbs.map((bc, index) => (
      <Fragment key={`breadCrumb-${bc.text}`}>
        <BreadcrumbFragment breadcrumb={bc} />
        {breadcrumbs.length - 1 !== index && (
          <Icon
            data-cy="breadcrumb-chevron"
            fill={gray.dark2}
            glyph="ChevronRight"
            size="small"
          />
        )}
      </Fragment>
    ))}
  </Container>
);

interface BreadcrumbFragmentProps {
  breadcrumb: Breadcrumb;
}
const BreadcrumbFragment: React.VFC<BreadcrumbFragmentProps> = ({
  breadcrumb,
}) => {
  const { href, text = "", to, onClick, "data-cy": dataCy } = breadcrumb;
  const shouldTrimMessage = text.length > 30;
  const message = trimStringFromMiddle(text, 30);

  let trigger;
  if (to) {
    trigger = (
      <StyledRouterLink data-cy={dataCy} onClick={onClick} to={to}>
        {message}
      </StyledRouterLink>
    );
  } else if (href) {
    trigger = (
      <div>
        <StyledLink data-cy={dataCy} href={href} onClick={onClick}>
          {message}
        </StyledLink>
      </div>
    );
  } else {
    trigger = <div data-cy={dataCy}>{message}</div>;
  }

  return (
    <Tooltip
      data-cy="breadcrumb-tooltip"
      enabled={shouldTrimMessage}
      trigger={trigger}
      triggerEvent="hover"
    >
      {text}
    </Tooltip>
  );
};

const Container = styled.nav`
  display: flex;
  align-items: center;
  gap: ${size.xxs};

  a {
    font-size: inherit;
  }
`;

export default Breadcrumbs;
