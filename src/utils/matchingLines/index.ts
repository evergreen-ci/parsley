import { CaseSensitivity, FilterLogic, MatchType } from "constants/enums";
import { Filters } from "types/logs";
import { reportError } from "utils/errorReporting";
/**
 * `constructRegexToMatch` constructs an array of regex expressions that represents the current filters
 * being applied.
 * @param visibleFilters - filters which have visibility toggled on
 * @returns an array of objects containing a regex expression and a boolean indicating if the match is exact or not
 */
export const constructRegexToMatch = (visibleFilters: Filters) => {
  const regexToMatch: { regex: RegExp; isMatch: boolean }[] = [];

  visibleFilters.forEach((f) => {
    const isMatch = f.matchType === MatchType.Exact;
    if (f.caseSensitive === CaseSensitivity.Sensitive) {
      regexToMatch.push({
        isMatch,
        regex: new RegExp(f.name),
      });
    } else {
      try {
        const regex = new RegExp(f.name, "i");
        regexToMatch.push({
          isMatch,
          regex,
        });
      } catch (e) {
        // If we get an error here, it means the regex is invalid and got past the validation step. We should report this error.
        reportError({
          message: `The regex "${f.name}" is invalid`,
          metadata: e,
          name: "Invalid Regex",
        }).severe();
      }
    }
  });

  return regexToMatch;
};

/**
 * `matchesFilters` tests if a given log line matches the applied filters.
 * @param line - a log line
 * @param regexToMatch - an array of objects containing a regex expression and a boolean indicating if the match is exact or not
 * @param filterLogic - the filter mode, one of "AND" or "OR"
 * @returns true if the line matches the filters, false otherwise
 */
export const matchesFilters = (
  line: string,
  regexToMatch: { regex: RegExp; isMatch: boolean }[],
  filterLogic: FilterLogic
) => {
  if (filterLogic === FilterLogic.And) {
    return regexToMatch.every(({ isMatch, regex }) =>
      isMatch ? regex.test(line) : !regex.test(line)
    );
  }
  return regexToMatch.some(({ isMatch, regex }) =>
    isMatch ? regex.test(line) : !regex.test(line)
  );
};

/**
 * `getMatchingLines` determines which log lines match the applied filters. This function returns undefined if no
 * filters have been applied.
 * @param logLines - list of strings representing the log lines
 * @param filters - list of filters being applied
 * @param filterLogic - the filter mode, one of "AND" or "OR"
 * @returns a set of numbers representing the matched lines, or undefined if no filters have been applied
 */
export const getMatchingLines = (
  logLines: string[],
  filters: Filters,
  filterLogic: FilterLogic
) => {
  const visibleFilters = filters.filter((f) => f.visible !== false);
  if (visibleFilters.length === 0) {
    return undefined;
  }

  const regexToMatch = constructRegexToMatch(visibleFilters);
  const set = new Set<number>();

  logLines.forEach((line, idx) => {
    if (matchesFilters(line, regexToMatch, filterLogic)) {
      set.add(idx);
    }
  });

  return set;
};
