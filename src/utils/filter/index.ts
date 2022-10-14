import { CaseSensitivity, FilterLogic, MatchType } from "constants/enums";
import type { ParsedFilter } from "types/filters";
import { ProcessedLogLines } from "types/logs";
import { isCollapsedRow } from "utils/collapsedRow";

type FilterLogsParams = {
  logLines: string[];
  filters: ParsedFilter[];
  bookmarks: number[];
  selectedLine: number | undefined;
  filterLogic: FilterLogic;
};

/**
 * `filterLogs` processes log lines according to what filters, bookmarks, and selected line are applied.
 * @param {string[]} obj.logLines - list of strings representing the log lines
 * @param {ParsedFilter[]} obj.filters  - list of strings representing the filters being applied
 * @param {number[]} obj.bookmarks - list of line numbers representing bookmarks
 * @param {number | undefined} obj.selectedLine - a line number representing a selected line
 * @param {ExpandedLines} obj.expandedLines - an array of intervals representing expanded ranges
 * @param {FilterLogic} obj.filterLogic - specifies whether to use AND or OR when applying filters
 * @returns an array of numbers that indicates which log lines should be displayed, and which log lines
 * should be collapsed
 */
export const filterLogs = ({
  logLines,
  filters,
  bookmarks,
  selectedLine,
  filterLogic,
}: FilterLogsParams): ProcessedLogLines => {
  if (filters.length === 0) {
    return logLines.map((_, idx) => idx);
  }

  const filteredLines: ProcessedLogLines = [];

  logLines.reduce((arr, logLine, idx) => {
    // Bookmarks and selected lines should always remain uncollapsed.
    if (bookmarks.includes(idx) || selectedLine === idx) {
      arr.push(idx);
      return arr;
    }

    // If the line matches the filters, it should remain uncollapsed.
    if (matchesFilter(logLine, filters, filterLogic)) {
      arr.push(idx);
      return arr;
    }

    // If the line doesn't match the filters, collapse it.
    const previousItem = arr[arr.length - 1];
    if (isCollapsedRow(previousItem)) {
      previousItem.push(idx);
    } else {
      arr.push([idx]);
    }
    return arr;
  }, filteredLines);

  return filteredLines;
};

/**
 * `matchesFilter` determines if a particular log line satisfies the filter conditions.
 * @param logLine - string representing a log line
 * @param filters - list of filters being applied
 * @param filterLogic - specifies whether to use AND or OR filtering
 * @returns true if filter conditions are satisfied, false otherwise
 */
export const matchesFilter = (
  logLine: string,
  filters: ParsedFilter[],
  filterLogic: FilterLogic
): boolean => {
  const visibleFilters = filters.filter((f) => f.visible !== false);

  if (visibleFilters.length === 0) {
    return true;
  }

  const regexToMatch: { regex: RegExp; isMatch: boolean }[] = [];

  visibleFilters.forEach((f) => {
    const isMatch = f.matchType === MatchType.Exact;
    if (f.caseSensitive === CaseSensitivity.Sensitive) {
      regexToMatch.push({
        regex: new RegExp(f.name),
        isMatch,
      });
    } else {
      regexToMatch.push({
        regex: new RegExp(f.name, "i"),
        isMatch,
      });
    }
  });

  if (filterLogic === FilterLogic.And) {
    return regexToMatch.every(({ regex, isMatch }) =>
      isMatch ? regex.test(logLine) : !regex.test(logLine)
    );
  }
  return regexToMatch.some(({ regex, isMatch }) =>
    isMatch ? regex.test(logLine) : !regex.test(logLine)
  );
};
