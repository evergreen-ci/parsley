import styled from "@emotion/styled";
import { size } from "constants/tokens";
import ButtonRow from "./ButtonRow";
import SearchRangeInput from "./SearchRangeInput";
import {
  CaseSensitiveToggle,
  ExpandableRowsToggle,
  FilterLogicToggle,
  PrettyPrintToggle,
  WrapToggle,
} from "./Toggles";

interface DetailsOverlayProps {
  ["data-cy"]?: string;
}

const DetailsOverlay: React.FC<DetailsOverlayProps> = ({
  "data-cy": dataCy,
}) => (
  <DetailsOverlayCard data-cy={dataCy}>
    <Container>
      <SearchRangeInput />
      <WrapToggle />
      <CaseSensitiveToggle />
    </Container>
    <Container>
      <FilterLogicToggle />
      <ExpandableRowsToggle />
      <PrettyPrintToggle />
      <ButtonRow />
    </Container>
  </DetailsOverlayCard>
);

const DetailsOverlayCard = styled.div`
  width: 700px;
  padding: ${size.xs};
  display: flex;
  justify-content: space-between;
`;

const Container = styled.div`
  width: 300px;
`;

export default DetailsOverlay;
