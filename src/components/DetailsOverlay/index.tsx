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
} from "./Toggle";

interface DetailsOverlayProps {
  ["data-cy"]?: string;
}

const DetailsOverlay: React.FC<DetailsOverlayProps> = ({
  "data-cy": dataCy,
}) => (
  <Card data-cy={dataCy}>
    <FilterOptions>
      <FilterContainer>
        <SearchRangeInput />
        <WrapToggle />
        <CaseSensitiveToggle />
      </FilterContainer>
      <FilterContainer>
        <FilterLogicToggle />
        <ExpandableRowsToggle />
        <PrettyPrintToggle />
        <ButtonRow />
      </FilterContainer>
    </FilterOptions>
  </Card>
);

const Card = styled.div`
  width: 700px;
  padding: ${size.xs};
`;

const FilterOptions = styled.div`
  display: flex;
  justify-content: space-between;
`;

const FilterContainer = styled.div`
  width: 300px;
`;

export default DetailsOverlay;
