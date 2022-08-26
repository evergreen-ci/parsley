import { Link } from "@leafygreen-ui/typography";
import { Link as RouterLink } from "react-router-dom";

// Component could have one of 2 props type - to or href
type LinkProps = Omit<React.ComponentProps<typeof Link>, "as">;

const StyledLink: React.FC<LinkProps> = ({ href, children, ...rest }) => (
  <Link hideExternalIcon href={href} {...rest}>
    {children}
  </Link>
);

const StyledRouterLink: React.FC<LinkProps & { to: string }> = ({
  to,
  children,
  ...rest
}) => (
  <Link hideExternalIcon to={to} {...rest} as={RouterLink}>
    {children}
  </Link>
);

export { StyledLink, StyledRouterLink };
