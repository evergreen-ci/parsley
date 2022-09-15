import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import Filter from "components/Filter";
import { QueryParams } from "constants/queryParams";
import { size } from "constants/tokens";
import { useQueryParam } from "hooks/useQueryParam";

const { gray } = palette;

interface FiltersProps {
  ["data-cy"]?: string;
}

const Filters: React.FC<FiltersProps> = ({ "data-cy": dataCy }) => {
  const [filters, setFilters] = useQueryParam<string[]>(
    QueryParams.Filters,
    []
  );

  const deleteFilter = (filterName: string) => {
    const newFilters = filters.filter((f) => f !== filterName);
    setFilters(newFilters);
  };

  const hasFilters = filters.length > 0;

  return (
    <Card data-cy={dataCy}>
      {hasFilters ? (
        filters.map((filter) => (
          <Wrapper key={filter}>
            <Filter deleteFilter={deleteFilter} filterText={filter} />
          </Wrapper>
        ))
      ) : (
        <> No filters have been applied.</>
      )}
    </Card>
  );
};

const Wrapper = styled.div`
  background-color: ${gray.light2}66;
  padding: ${size.s} 0 ${size.s} ${size.s};
  border-radius: ${size.s};
  margin-bottom: ${size.s};
`;

const Card = styled.div`
  width: 600px;
  max-height: 400px;
  overflow-y: scroll;
  padding: ${size.xxs};
`;

export default Filters;
