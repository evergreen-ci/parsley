import { Fragment, ReactNode } from "react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import Tooltip from "@leafygreen-ui/tooltip";
import Icon from "components/Icon";
import { StyledLink, StyledRouterLink } from "components/styles";
import { size } from "constants/tokens";
import { trimStringFromMiddle } from "utils/string";

const { gray } = palette;

export interface Breadcrumb {
  "data-cy"?: string;
  href?: string;
  onClick?: () => void;
  text: ReactNode;
  to?: string;
  tooltipText?: ReactNode;
}
interface BreadcrumbsProps {
  breadcrumbs: Breadcrumb[];
}
const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ breadcrumbs }) => (
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
const BreadcrumbFragment: React.FC<BreadcrumbFragmentProps> = ({
  breadcrumb,
}) => {
  const {
    href,
    text = "",
    to,
    tooltipText,
    onClick,
    "data-cy": dataCy,
  } = breadcrumb;
  const shouldTrimMessage =
    typeof text === "string" ? text?.length > 30 : false;
  const message =
    typeof text === "string" ? trimStringFromMiddle(text, 30) : text;

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
      enabled={shouldTrimMessage || !!tooltipText}
      trigger={trigger}
      triggerEvent="hover"
    >
      {tooltipText || text}
    </Tooltip>
  );
};

const Container = styled.nav`
  display: flex;
  align-items: center;
  gap: ${size.xxs};
`;

export default Breadcrumbs;
