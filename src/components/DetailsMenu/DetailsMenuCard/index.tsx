import { forwardRef } from "react";
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
  "data-cy"?: string;
}

const DetailsMenuCard = forwardRef<HTMLDivElement, DetailsMenuProps>(
  ({ "data-cy": dataCy }, ref) => (
    <Container ref={ref} data-cy={dataCy}>
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
  )
);
DetailsMenuCard.displayName = "DetailsMenuCard";

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
