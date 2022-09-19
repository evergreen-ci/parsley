import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import Toggle from "@leafygreen-ui/toggle";
import { Disclaimer } from "@leafygreen-ui/typography";
import { size } from "constants/tokens";
import { FilterRow, StyledSubtitle } from "../../styles";

const { gray } = palette;

interface BaseToggleProps {
  ["data-cy"]?: string;
  leftLabel?: string;
  rightLabel?: string;
  label: string;
  value: boolean;
  onChange: (checked: boolean) => void;
}

const BaseToggle: React.FC<BaseToggleProps> = ({
  "data-cy": dataCy,
  rightLabel = "ON",
  leftLabel = "OFF",
  label,
  value,
  onChange,
}) => (
  <FilterRow>
    <StyledSubtitle>{label}</StyledSubtitle>
    <ToggleWithLabel>
      <StyledDisclaimer>{leftLabel}</StyledDisclaimer>
      <Toggle
        aria-labelledby="base-toggle"
        checked={value}
        data-cy={dataCy}
        onChange={onChange}
        size="small"
      />
      <StyledDisclaimer>{rightLabel}</StyledDisclaimer>
    </ToggleWithLabel>
  </FilterRow>
);

const StyledDisclaimer = styled(Disclaimer)`
  color: ${gray.base};
  margin: 0 ${size.xxs};
`;

const ToggleWithLabel = styled.div`
  display: flex;
  align-items: center;
`;

export default BaseToggle;
