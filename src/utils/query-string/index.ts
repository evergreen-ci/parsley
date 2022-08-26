import { parse, stringify } from "query-string";

interface ParseQueryString {
  [key: string]: string | (string | null)[] | null;
}
export const parseQueryString = (search: string): ParseQueryString =>
  parse(search, { arrayFormat: "comma" });

export const getString = (param: string | string[] = ""): string =>
  Array.isArray(param) ? param[0] : param;

export const queryParamAsNumber = (str: string | string[]) =>
  !Number.isNaN(Number(str)) ? Number(str) : null;

export const stringifyQuery = (object: { [key: string]: any }) =>
  stringify(object, { arrayFormat: "comma" });
