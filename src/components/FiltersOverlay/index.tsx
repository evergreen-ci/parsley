import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { QueryParams } from "constants/queryParams";
import { size } from "constants/tokens";
import { useQueryParam } from "hooks/useQueryParam";
import Filter from "./Filter";

const { gray } = palette;

interface FiltersOverlayProps {
  ["data-cy"]?: string;
}

const FiltersOverlay: React.FC<FiltersOverlayProps> = ({
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
    <FiltersOverlayCard data-cy={dataCy}>
      {filters.length ? (
        filters.map((filter) => (
          <FilterWrapper key={filter}>
            <Filter deleteFilter={deleteFilter} filterName={filter} />
          </FilterWrapper>
        ))
      ) : (
        <> No filters have been applied.</>
      )}
    </FiltersOverlayCard>
  );
};

const FiltersOverlayCard = styled.div`
  width: 600px;
  max-height: 400px;
  overflow-y: scroll;
  padding: ${size.xxs};
`;

const FilterWrapper = styled.div`
  background-color: ${gray.light2}66;
  padding: ${size.xs} ${size.s};
  border-radius: ${size.s};
  margin-bottom: ${size.s};
`;

export default FiltersOverlay;
