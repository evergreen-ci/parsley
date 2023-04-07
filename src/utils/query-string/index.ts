import queryString, { ParseOptions, StringifyOptions } from "query-string";
import { CaseSensitivity, MatchType } from "constants/enums";
import { Filters } from "types/logs";

export const parseQueryString = (
  search: string,
  options: ParseOptions = {}
) => {
  const parseOptions: ParseOptions = {
    arrayFormat: "comma",
    parseBooleans: true,
    parseNumbers: true,
    ...options,
  };
  return queryString.parse(search, parseOptions);
};

export const stringifyQuery = (
  object: { [key: string]: any },
  options: StringifyOptions = {}
) =>
  queryString.stringify(object, {
    arrayFormat: "comma",
    skipNull: true,
    skipEmptyString: true,
    ...options,
  });

export const parseFilters = (filters: string[]): Filters => {
  const parsedFilters: Filters = filters.map((f) => {
    // Ensure that a filter is a string before parsing it.
    const filter = f.toString();

    const visible = filter.charAt(0) === "1";
    const caseSensitive =
      filter.charAt(1) === "1"
        ? CaseSensitivity.Sensitive
        : CaseSensitivity.Insensitive;
    const matchType =
      filter.charAt(2) === "1" ? MatchType.Inverse : MatchType.Exact;
    const name = filter.substring(3);
    const decodedFilterName = decodeURIComponent(name);
    return {
      visible,
      caseSensitive,
      matchType,
      name: decodedFilterName,
    };
  });
  return parsedFilters;
};

export const stringifyFilters = (filters: Filters): string[] =>
  filters.map((f) => {
    const visible = f.visible ? 1 : 0;
    const caseSensitive = f.caseSensitive === CaseSensitivity.Sensitive ? 1 : 0;
    const matchType = f.matchType === MatchType.Inverse ? 1 : 0;
    const encodedFilterName = encodeURIComponent(f.name);
    return `${visible}${caseSensitive}${matchType}${encodedFilterName}`;
  });
