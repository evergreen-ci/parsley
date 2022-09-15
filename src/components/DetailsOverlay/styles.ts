import styled from "@emotion/styled";
import { Subtitle } from "@leafygreen-ui/typography";
import { size } from "constants/tokens";
import { SubtitleType } from "types/leafygreen";

export const FilterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${size.m};
`;

export const StyledSubtitle = styled<SubtitleType>(Subtitle)`
  font-size: ${size.s};
`;
