import { useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Filters } from "types/logs";
import {
  parseFilters,
  parseQueryString,
  stringifyFilters,
  stringifyQuery,
} from "utils/query-string";

/** `useQueryParams` returns all of the query params passed into the url */
const useQueryParams = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setQueryString = useCallback(
    (params: { [key: string]: any }) => {
      const stringifiedQuery = stringifyQuery(params);
      navigate(`?${stringifiedQuery}`, { replace: true });
    },
    [navigate]
  );

  return [parseQueryString(searchParams.toString()), setQueryString] as const;
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
      ? (conditionalToArray(
          searchParams[param],
          Array.isArray(defaultParam)
        ) as unknown as T)
      : defaultParam;

  return [queryParam, setQueryParam] as const;
};

/**
 * `useFilterParam` is a specialized form of useQueryParam. It needs to do special processing when converting
 * filters to and from URLs.
 */
const useFilterParam = () => {
  const [searchParams, setSearchParams] = useQueryParams();

  const parsedFilters = parseFilters(
    conditionalToArray(searchParams.filters ?? [], true) as string[]
  );

  const setFiltersParam = useCallback(
    (filters: Filters) => {
      setSearchParams({
        ...searchParams,
        filters: stringifyFilters(filters),
      });
    },
    [setSearchParams, searchParams]
  );

  return [parsedFilters, setFiltersParam] as const;
};

/** `conditionalToArray` takes in a value and transforms it into an array if it is not one and should be */
const conditionalToArray = <T>(value: T, shouldBeArray: boolean) => {
  if (shouldBeArray) {
    return Array.isArray(value) ? value : [value];
  }
  return value;
};
export { useQueryParams, useQueryParam, useFilterParam };
