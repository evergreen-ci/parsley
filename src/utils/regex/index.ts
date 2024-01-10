import { stringIntersection } from "utils/string";

/**
 * `hasOverlappingRegex` - Checks if 2 regexes overlap each other
 * @param regex1 - the first regex
 * @param regex2 - the second regex
 * @param text - the text to match the regexes against
 * @returns true if regexes overlap, false otherwise
 */
const hasOverlappingRegex = (
  regex1: RegExp | undefined,
  regex2: RegExp | undefined,
  text: string,
) => {
  if (regex1 === undefined || regex2 === undefined) {
    return false;
  }
  const regex1Matches = text.match(regex1);
  const regex2Matches = text.match(regex2);
  if (regex1Matches && regex2Matches) {
    return stringIntersection(regex1Matches[0], regex2Matches[0]);
  }
  return false;
};

export { hasOverlappingRegex };
