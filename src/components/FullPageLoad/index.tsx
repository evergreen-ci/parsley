import styled from "@emotion/styled";
import { Body } from "@leafygreen-ui/typography";

export const FullPageLoad: React.FC = () => (
  <FullPage>
    <Body>LOADING...</Body>
  </FullPage>
);

const FullPage = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;
