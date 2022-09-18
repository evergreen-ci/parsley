import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import TextInput from "@leafygreen-ui/text-input";
import { QueryParams } from "constants/queryParams";
import { size } from "constants/tokens";
import { useQueryParam } from "hooks/useQueryParam";
import { FilterRow, StyledSubtitle } from "../styles";

const { red } = palette;

const SearchRangeInput: React.FC = () => {
  const [lowerBound, setLowerQueryParam] = useQueryParam<number | undefined>(
    QueryParams.LowerRange,
    undefined
  );
  const [upperBound, setUpperBound] = useQueryParam<number | undefined>(
    QueryParams.UpperRange,
    undefined
  );

  const hasError =
    lowerBound !== undefined && upperBound !== undefined
      ? lowerBound > upperBound
      : false;

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
    <StyledFilterRow>
      <StyledSubtitle>Range</StyledSubtitle>

      <RangeContainer>
        <InputContainer>
          <RangeInput
            aria-labelledby="Range Lower Bound"
            data-cy="range-lower-bound"
            min={0}
            onChange={(e) => updateLowerBound(e.target.value)}
            placeholder="0"
            sizeVariant="small"
            state={hasError ? "error" : "none"}
            type="number"
            value={(lowerBound ?? "").toString()}
          />
          <RangeInput
            aria-labelledby="Range Upper Bound"
            data-cy="range-upper-bound"
            min={0}
            onChange={(e) => updateUpperBound(e.target.value)}
            placeholder="100"
            sizeVariant="small"
            state={hasError ? "error" : "none"}
            type="number"
            value={(upperBound ?? "").toString()}
          />
        </InputContainer>
        {hasError && (
          <WarningMessage>Specified range is not valid.</WarningMessage>
        )}
      </RangeContainer>
    </StyledFilterRow>
  );
};

const StyledFilterRow = styled(FilterRow)`
  align-items: flex-start;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
`;

const RangeContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const RangeInput = styled(TextInput)`
  width: ${size.xxl};
  margin-left: ${size.xs};
`;

const WarningMessage = styled.div`
  color: ${red.base};
  margin-top: ${size.xxs};
  margin-left: ${size.xs};
`;

export default SearchRangeInput;
