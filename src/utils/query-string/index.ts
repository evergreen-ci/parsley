import { parse, stringify } from "query-string";
import { CaseSensitivity, MatchType } from "constants/enums";
import type { ParsedFilter } from "types/filters";

export const parseQueryString = (search: string) =>
  parse(search, {
    arrayFormat: "comma",
    parseBooleans: true,
    parseNumbers: true,
  });

export const stringifyQuery = (object: { [key: string]: any }) =>
  stringify(object, {
    arrayFormat: "comma",
    skipNull: true,
    skipEmptyString: true,
  });

export const parseFilters = (filters: string[]): ParsedFilter[] => {
  const parsedFilters: ParsedFilter[] = filters.map((f) => {
    const visible = f.charAt(0) === "1";
    const caseSensitive =
      f.charAt(1) === "1"
        ? CaseSensitivity.Sensitive
        : CaseSensitivity.Insensitive;
    const matchType = f.charAt(2) === "1" ? MatchType.Inverse : MatchType.Exact;
    const name = f.substring(3);

    return {
      visible,
      caseSensitive,
      matchType,
      name,
    };
  });
  return parsedFilters;
};

export const stringifyFilters = (filters: ParsedFilter[]) =>
  filters
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((f) => {
      const visible = f.visible ? 1 : 0;
      const caseSensitive =
        f.caseSensitive === CaseSensitivity.Sensitive ? 1 : 0;
      const matchType = f.matchType === MatchType.Inverse ? 1 : 0;

      return `${visible}${caseSensitive}${matchType}${f.name}`;
    })
    .join(",");
