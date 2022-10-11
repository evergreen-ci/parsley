import notFound from "./notFound.svg";

// It's not possible to lazy load an SVG, so we wrap the SVG in a React component.
const NotFoundSvg: React.FC = () => (
  <img alt="Page not found" data-cy="404" src={notFound} />
);

export default NotFoundSvg;
