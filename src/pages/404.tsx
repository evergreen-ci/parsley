import { PageLayout } from "components/styles";
import notFound from "./404/notFound.svg";

const NotFound: React.FC = () => (
  <PageLayout>
    <img alt="Page not found" data-cy="404" src={notFound} />
  </PageLayout>
);

export default NotFound;
