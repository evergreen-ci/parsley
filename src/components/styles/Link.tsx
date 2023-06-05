import { Link, LinkProps } from "@leafygreen-ui/typography";
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from "react-router-dom";

const StyledLink = (props: LinkProps<"a">) => (
  <Link hideExternalIcon {...props} />
);

const StyledRouterLink = (props: LinkProps<"span"> & RouterLinkProps) => (
  <Link
    /* @ts-expect-error */
    as={RouterLink}
    {...props}
  />
);

export { StyledLink, StyledRouterLink };
