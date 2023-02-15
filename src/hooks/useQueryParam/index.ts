import { useCallback } from "react";
import { ParseOptions } from "query-string";
import { useNavigate, useSearchParams } from "react-router-dom";
import { conditionalCastToArray } from "utils/array";
import { parseQueryString, stringifyQuery } from "utils/query-string";

/**
 * `useQueryParams` returns all of the query params that exist in the url.
 * @param parseOptions - options which define how to parse params from the url (optional)
 */
const useQueryParams = (parseOptions?: ParseOptions) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setQueryString = useCallback(
    (params: { [key: string]: any }) => {
      const stringifiedQuery = stringifyQuery(params);
      navigate(`?${stringifiedQuery}`, { replace: true });
    },
    [navigate]
  );

  return [
    parseQueryString(searchParams.toString(), parseOptions),
    setQueryString,
  ] as const;
};

/**
 * `useQueryParam` allows you to interact with a query param in the same way you would use a useState hook.
 *  The first argument is the name of the query param. The second argument is the initial value of the query param.
 *  `useQueryParam` will default to the second argument if the query param is not present in the url.
 */
const useQueryParam = <T>(
  param: string,
  defaultParam: T
): readonly [T, (set: T) => void] => {
  const [searchParams, setSearchParams] = useQueryParams();

  const setQueryParam = useCallback(
    (value: T) => {
      setSearchParams({
        ...searchParams,
        [param]: value,
      });
    },
    [setSearchParams, searchParams, param]
  );

  const queryParam =
    searchParams[param] !== undefined
      ? (conditionalCastToArray(
          searchParams[param],
          Array.isArray(defaultParam)
        ) as unknown as T)
      : defaultParam;

  return [queryParam, setQueryParam] as const;
};

export { useQueryParams, useQueryParam };
