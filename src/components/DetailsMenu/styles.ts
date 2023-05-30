import styled, { StyledComponent } from "@emotion/styled";
import { Subtitle, SubtitleProps } from "@leafygreen-ui/typography";
import { size } from "constants/tokens";

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${size.m};
`;

const DetailName = styled(Subtitle)`
  font-size: ${size.s};
` as StyledComponent<SubtitleProps>;

export { DetailRow, DetailName };
