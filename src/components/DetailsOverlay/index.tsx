import styled from "@emotion/styled";
import Filter from "components/Filter";
import { QueryParams } from "constants/queryParams";
import { size } from "constants/tokens";
import { useQueryParam } from "hooks/useQueryParam";
import {
  ButtonRow,
  CaseSensitiveToggle,
  ExpandableRowsToggle,
  FilterLogicToggle,
  LogV2Toggle,
  PrettyPrintToggle,
  SearchRange,
  WrapToggle,
} from "./Components";

interface DetailsOverlayProps {
  ["data-cy"]?: string;
}

const DetailsOverlay: React.FC<DetailsOverlayProps> = ({
  "data-cy": dataCy,
}) => {
  const [filters, setFilters] = useQueryParam<string[]>(
    QueryParams.Filters,
    []
  );

  const deleteFilter = (filterName: string) => {
    const newFilters = filters.filter((f) => f !== filterName);
    setFilters(newFilters);
  };

  return (
    <Card data-cy={dataCy}>
      <FilterOptions>
        <FilterContainer>
          <SearchRange />
          <WrapToggle />
          <CaseSensitiveToggle />
          <LogV2Toggle />
        </FilterContainer>

        <FilterContainer>
          <FilterLogicToggle />
          <ExpandableRowsToggle />
          <PrettyPrintToggle />
          <ButtonRow />
        </FilterContainer>
      </FilterOptions>

      {filters.length !== 0 && <Divider />}
      {filters.map((filter) => (
        <Filter key={filter} deleteFilter={deleteFilter} filterText={filter} />
      ))}
    </Card>
  );
};

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

const Divider = styled.hr`
  margin: ${size.xxs} 0 ${size.xs} 0;
`;

export default DetailsOverlay;
