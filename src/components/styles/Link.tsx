import { Link, LinkProps } from "@leafygreen-ui/typography";
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from "react-router-dom";

// @ts-expect-error
const StyledLink = (props: LinkProps) => <Link hideExternalIcon {...props} />;

const StyledRouterLink = (props: LinkProps & RouterLinkProps) => (
  /* @ts-expect-error */
  <Link as={RouterLink} hideExternalIcon {...props} />
);

export { StyledLink, StyledRouterLink };
