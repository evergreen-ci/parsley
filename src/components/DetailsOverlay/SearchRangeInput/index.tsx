import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import TextInput from "@leafygreen-ui/text-input";
import { QueryParams } from "constants/queryParams";
import { size } from "constants/tokens";
import { useQueryParam } from "hooks/useQueryParam";
import { FilterRow, StyledSubtitle } from "../styles";

const { red } = palette;

const SearchRangeInput: React.FC = () => {
  // TODO: Manage search range in LogContext rather than as query params.
  const [lowerBound, setLowerBound] = useQueryParam<number | undefined>(
    QueryParams.LowerRange,
    undefined
  );
  const [upperBound, setUpperBound] = useQueryParam<number | undefined>(
    QueryParams.UpperRange,
    undefined
  );

  const hasError =
    lowerBound !== undefined &&
    upperBound !== undefined &&
    lowerBound > upperBound;

  const updateLowerBound = (newVal: string) => {
    if (newVal === "") {
      setLowerBound(undefined);
    } else {
      setLowerBound(parseInt(newVal, 10));
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

      <RangeInputContainer>
        <RangeInputWrapper>
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
        </RangeInputWrapper>
        {hasError && (
          <ErrorMessage data-cy="range-error-message">
            Specified range is not valid.
          </ErrorMessage>
        )}
      </RangeInputContainer>
    </StyledFilterRow>
  );
};

const StyledFilterRow = styled(FilterRow)`
  align-items: flex-start;
`;

const RangeInputContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const RangeInputWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const RangeInput = styled(TextInput)`
  width: ${size.xxl};
  margin-left: ${size.xs};
`;

const ErrorMessage = styled.div`
  color: ${red.base};
  margin-top: ${size.xxs};
  margin-left: ${size.xs};
`;

export default SearchRangeInput;
