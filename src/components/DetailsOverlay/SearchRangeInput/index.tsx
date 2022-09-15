import styled from "@emotion/styled";
import TextInput from "@leafygreen-ui/text-input";
import { QueryParams } from "constants/queryParams";
import { size } from "constants/tokens";
import { useQueryParam } from "hooks/useQueryParam";
import { FilterRow, StyledSubtitle } from "../styles";

const SearchRangeInput: React.FC = () => {
  const [lowerBound, setLowerQueryParam] = useQueryParam<number | undefined>(
    QueryParams.LowerRange,
    undefined
  );
  const [upperBound, setUpperBound] = useQueryParam<number | undefined>(
    QueryParams.UpperRange,
    undefined
  );

  const updateLowerBound = (newVal: string) => {
    if (newVal === "") {
      setLowerQueryParam(undefined);
    } else {
      setLowerQueryParam(parseInt(newVal, 10));
    }
  };

  const updateUpperBound = (newVal: string) => {
    if (newVal === "") {
      setUpperBound(undefined);
    } else {
      setUpperBound(parseInt(newVal, 10));
    }
  };

  return (
    <FilterRow>
      <StyledSubtitle>Range</StyledSubtitle>
      <RangeContainer>
        <RangeInput
          aria-labelledby="Range Lower Bound"
          data-cy="range-lower-bound"
          min={0}
          onChange={(e) => updateLowerBound(e.target.value)}
          placeholder="0"
          sizeVariant="small"
          type="number"
          value={(lowerBound ?? "").toString()}
        />
        <RangeInput
          aria-labelledby="Range Upper Bound"
          data-cy="range-upper-bound"
          min={-1}
          onChange={(e) => updateUpperBound(e.target.value)}
          placeholder="-1"
          sizeVariant="small"
          type="number"
          value={(upperBound ?? "").toString()}
        />
      </RangeContainer>
    </FilterRow>
  );
};

const RangeContainer = styled.div`
  display: flex;
`;

const RangeInput = styled(TextInput)`
  width: ${size.xxl};
  margin-left: ${size.xs};
`;

export default SearchRangeInput;
