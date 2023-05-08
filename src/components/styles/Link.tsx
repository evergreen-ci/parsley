import {
  InferredPolymorphic,
  InferredPolymorphicProps,
} from "@leafygreen-ui/polymorphic";
import { Link, LinkProps } from "@leafygreen-ui/typography";
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from "react-router-dom";

const StyledLink = InferredPolymorphic<LinkProps, "a">((props) => (
  <Link hideExternalIcon {...props} />
));

const StyledRouterLink: React.FC<LinkProps & RouterLinkProps> = (props) => (
  <Link as={RouterLink} hideExternalIcon {...props} />
);

export { StyledLink, StyledRouterLink };
