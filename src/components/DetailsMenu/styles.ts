import styled from "@emotion/styled";
import { Subtitle } from "@leafygreen-ui/typography";
import { size } from "constants/tokens";
import { SubtitleType } from "types/leafygreen";

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${size.m};
`;

const DetailName = styled<SubtitleType>(Subtitle)`
  font-size: ${size.s};
`;

export { DetailRow, DetailName };
