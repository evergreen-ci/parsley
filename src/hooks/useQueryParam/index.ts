import { useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { parseQueryString, stringifyQuery } from "utils/query-string";

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

/** `useQueryParam` allows you to interact with a query param in the same way you would use a useState hook.  */
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

  return [
    searchParams[param] !== undefined
      ? (conditionalToArray(
          searchParams[param],
          Array.isArray(defaultParam)
        ) as unknown as T)
      : defaultParam,
    setQueryParam,
  ] as const;
};

/** `conditionalToArray` takes in a value and transforms it into an array if it is not one and should be */
const conditionalToArray = <T>(value: T, shouldBeArray: boolean) => {
  if (shouldBeArray) {
    return Array.isArray(value) ? value : [value];
  }
  return value;
};
export { useQueryParams, useQueryParam };
