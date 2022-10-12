/**
 * isLineInRange returns true if the line number is within the range of the search
 * @param range {lowerRange: number, upperRange?: number} - the range of lines to search
 * @param index number - the index to check
 * @returns boolean - whether the index is within the range
 */
const isLineInRange = (
  range: { lowerRange: number; upperRange?: number },
  index: number
) => {
  if (range.upperRange) {
    return index >= range.lowerRange && index <= range.upperRange;
  }
  return index >= range.lowerRange;
};

export { isLineInRange };
