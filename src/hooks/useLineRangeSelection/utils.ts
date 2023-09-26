import { SelectedLineRange } from "types/logs";

/**
 * `parseSelectedLineRange` parses the selected line range into an object
 * with the start and end line numbers.
 * @param selectedLineRange - the selected line range
 * @returns an object with the start and end line numbers
 */
const parseSelectedLineRange = (
  selectedLineRange: string
): SelectedLineRange => {
  const [start, end] = selectedLineRange.split("-");
  // start and end start with L, so we need to remove it
  const startLine = start.slice(1);
  const endLine = end ? end.slice(1) : undefined;
  return {
    endingLine: endLine ? parseInt(endLine, 10) : undefined,
    startingLine: parseInt(startLine, 10),
  };
};

/**
 * `encodeSelectedLineRange` encodes the selected line range into a string.
 * @param params - the selected line range
 * @param params.endingLine - the ending line number
 * @param params.startingLine - the starting line number
 * @returns - the encoded selected line range string
 */
const encodeSelectedLineRange = ({
  endingLine,
  startingLine,
}: SelectedLineRange) => {
  if (startingLine === undefined) {
    return undefined;
  }
  if (endingLine === undefined) {
    return `L${startingLine}`;
  }
  if (startingLine === endingLine) {
    return `L${startingLine}`;
  }
  return `L${startingLine}-L${endingLine}`;
};
export { parseSelectedLineRange, encodeSelectedLineRange };
