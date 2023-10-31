import styled from "@emotion/styled";
import { size } from "constants/tokens";
import ButtonRow from "./ButtonRow";
import CLIInstructions from "./CLIInstructions";
import SearchRangeInput from "./SearchRangeInput";
import {
  CaseSensitiveToggle,
  ExpandableRowsToggle,
  FilterLogicToggle,
  PrettyPrintToggle,
  WrapToggle,
} from "./Toggles";

interface DetailsMenuProps {
  ["data-cy"]?: string;
}

const DetailsMenuCard: React.FC<DetailsMenuProps> = ({ "data-cy": dataCy }) => (
  <Container data-cy={dataCy}>
    <Row>
      <Column>
        <SearchRangeInput />
        <WrapToggle />
        <CaseSensitiveToggle />
      </Column>
      <Column>
        <FilterLogicToggle />
        <ExpandableRowsToggle />
        <PrettyPrintToggle />
      </Column>
    </Row>
    <ButtonRow />
    <CLIInstructions />
  </Container>
);

const Container = styled.div`
  width: 700px;
  padding: ${size.xs};
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
const Column = styled.div`
  width: 300px;
`;

export default DetailsMenuCard;
