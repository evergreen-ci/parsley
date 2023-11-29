import styled from "@emotion/styled";
import { InfoSprinkle } from "@leafygreen-ui/info-sprinkle";
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
  margin-right: ${size.xs};
`;

const LabelWrapper = styled.div`
  display: flex;
  align-items: center;
`;

interface DetailsLabelProps {
  label: string;
  children: string;
}
const DetailsLabel: React.FC<DetailsLabelProps> = ({ children, label }) => (
  <LabelWrapper>
    <DetailName>{children}</DetailName>
    {/* @ts-expect-error Temporarily until I figure out whats wrong with this */}
    <InfoSprinkle>{label}</InfoSprinkle>
  </LabelWrapper>
);
export { DetailRow, DetailName, DetailsLabel };
