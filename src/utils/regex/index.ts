import { stringIntersection } from "utils/string";

/**
 * `hasOverlappingRegex` - Checks if 2 regexes overlap each other
 * @param regex1
 * @param regex2
 * @param text
 * @returns true if regexes overlap, false otherwise
 */
const hasOverlappingRegex = (regex1: RegExp, regex2: RegExp, text: string) => {
  const regex1Matches = text.match(regex1);
  const regex2Matches = text.match(regex2);
  if (regex1Matches && regex2Matches) {
    return stringIntersection(regex1Matches[0], regex2Matches[0]);
  }
  return false;
};

export { hasOverlappingRegex };
