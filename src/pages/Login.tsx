import { useState } from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { palette } from "@leafygreen-ui/palette";
import TextInput from "@leafygreen-ui/text-input";
import { Location } from "history";
import { Navigate, useLocation } from "react-router-dom";
import { size } from "constants/tokens";
import { useAuthContext } from "context/auth";

const { green } = palette;

const getReferrer = (location: Location): string => {
  const state = location.state as { referrer?: string };
  return state?.referrer ?? "/";
};

export const Login: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, devLogin } = useAuthContext();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return isAuthenticated ? (
    <Navigate to={getReferrer(location)} />
  ) : (
    <LoginWrapper>
      <Form>
        <TextInput
          data-cy="login-username"
          label="Username"
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          value={username}
        />
        <TextInput
          data-cy="login-password"
          label="Password"
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          value={password}
        />
        <StyledButton
          data-cy="login-submit"
          onClick={() => devLogin({ username, password })}
          type="submit"
          variant="baseGreen"
        >
          Login
        </StyledButton>
      </Form>
    </LoginWrapper>
  );
};

const LoginWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: ${size.s};

  width: 400px;
  padding: ${size.l} ${size.m};
  background-color: ${green.light3};
  border-radius: ${size.m};
`;

const StyledButton = styled(Button)`
  align-self: flex-end;
`;
