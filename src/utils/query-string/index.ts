import { parse, stringify } from "query-string";

export const parseQueryString = (search: string) =>
  parse(search, {
    arrayFormat: "comma",
    parseBooleans: true,
    parseNumbers: true,
  });

export const stringifyQuery = (object: { [key: string]: any }) =>
  stringify(object, { arrayFormat: "comma" });
