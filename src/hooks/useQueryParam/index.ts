import { useCallback, useMemo } from "react";
import { ParseOptions } from "query-string";
import { useNavigate, useSearchParams } from "react-router-dom";
import { QueryParams } from "constants/queryParams";
import { conditionalCastToArray } from "utils/array";
import { parseQueryString, stringifyQuery } from "utils/query-string";

/**
 * `useQueryParams` returns all of the query params that exist in the url.
 * @param parseOptions - options which define how to parse params from the url (optional)
 * @returns a tuple containing the parsed query params and a function to set the query params
 */
const useQueryParams = (parseOptions?: ParseOptions) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setQueryString = useCallback(
    (params: { [key: string]: any }) => {
      const stringifiedQuery = stringifyQuery(params, {
        skipEmptyString: false,
      });
      navigate(`?${stringifiedQuery}`, { replace: true });
    },
    [navigate]
  );

  const searchParamsObject = useMemo(
    () => parseQueryString(searchParams.toString(), parseOptions),
    [searchParams, parseOptions]
  );
  return [searchParamsObject, setQueryString] as const;
};

/**
 * `useQueryParam` allows you to interact with a query param in the same way you would use a useState hook.
 *  The first argument is the name of the query param. The second argument is the initial value of the query param.
 *  `useQueryParam` will default to the second argument if the query param is not present in the url.
 * @param param - the name of the query param
 * @param defaultParam - the default value of the query param
 * @returns a tuple containing the parsed query param and a function to set the query param
 */
const useQueryParam = <T>(
  param: QueryParams,
  defaultParam: T
): readonly [T, (set: T) => void] => {
  const [searchParams, setSearchParams] = useQueryParams();

  const setQueryParam = useCallback(
    (value: T) => {
      const newParams = {
        ...searchParams,
      };
      Object.entries(newParams).forEach(([paramKey, paramValue]) => {
        if (paramValue === undefined) {
          delete newParams[paramKey];
        }
        if (Array.isArray(paramValue)) {
          newParams[paramKey] = paramValue.map((v) =>
            v != null ? encodeURIComponent(v) : null
          );
        }
      });
      setSearchParams({
        ...newParams,
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
