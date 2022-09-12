import styled from "@emotion/styled";
import { Subtitle } from "@leafygreen-ui/typography";
import { size } from "constants/tokens";

export const FilterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${size.m};
`;

// @ts-ignore-error
export const StyledSubtitle = styled(Subtitle as div)`
  font-size: ${size.s};
`;
