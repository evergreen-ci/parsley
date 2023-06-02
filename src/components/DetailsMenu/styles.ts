import styled from "@emotion/styled";
import { Subtitle, SubtitleProps } from "@leafygreen-ui/typography";
import { size } from "constants/tokens";

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${size.m};
`;

const DetailName = styled(Subtitle)<SubtitleProps>`
  font-size: ${size.s};
`;

export { DetailRow, DetailName };
