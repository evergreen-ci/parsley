import { QueryParams } from "constants/queryParams";
import { useQueryParam } from "hooks/useQueryParam";
import { SelectedLineRange } from "types/logs";
import { encodeSelectedLineRange, parseSelectedLineRange } from "./utils";

const useLineRangeSelection = (): readonly [
  SelectedLineRange,
  (range: SelectedLineRange) => void
] => {
  const [selectedLineRange, setSelectedLineRange] = useQueryParam<
    string | undefined
  >(QueryParams.SelectedLineRange, undefined);

  const setLineRange = ({ endingLine, startingLine }: SelectedLineRange) => {
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
