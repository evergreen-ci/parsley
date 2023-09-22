import { QueryParams } from "constants/queryParams";
import { useQueryParam } from "hooks/useQueryParam";
import { encodeSelectedLineRange, parseSelectedLineRange } from "./utils";

const useLineRangeSelection = () => {
  const [selectedLineRange, setSelectedLineRange] = useQueryParam<
    string | undefined
  >(QueryParams.SelectedLineRange, undefined);

  const setLineRange = ({
    endingLine,
    startingLine,
  }: {
    startingLine?: number;
    endingLine?: number;
  }) => {
    setSelectedLineRange(encodeSelectedLineRange({ endingLine, startingLine }));
  };
  const { endingLine, startingLine } = selectedLineRange
    ? parseSelectedLineRange(selectedLineRange)
    : { endingLine: undefined, startingLine: undefined };

  return [
    {
      endingLine,
      startingLine,
    },
    setLineRange,
  ] as const;
};

export default useLineRangeSelection;
