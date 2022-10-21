import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { H1, H2 } from "@leafygreen-ui/typography";
import { size } from "constants/tokens";
import { H1Type, H2Type } from "types/leafygreen";
import errorPage from "./errorPage.svg";

const { white } = palette;

const ErrorFallback = () => (
  <div>
    <Text>
      <StyledHeader>Error</StyledHeader>
      <StyledSubtitle>
        Ouch! That&apos;s gotta hurt,
        <br /> sorry about that!
      </StyledSubtitle>
      <StyledLink href="/">Back To Home</StyledLink>
    </Text>
    <img alt="Error Background" src={errorPage} />
  </div>
);

export default ErrorFallback;

const StyledHeader = styled<H1Type>(H1)`
  color: ${white};
`;

const StyledSubtitle = styled<H2Type>(H2)`
  color: ${white};
`;

const StyledLink = styled.a`
  padding-top: ${size.xl};
  color: ${white};
  text-decoration: underline;
`;

const Text = styled.div`
  position: absolute;
  color: white;
  margin-left: 5%;
  margin-top: 10%;
`;
