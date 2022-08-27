import { useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { parseQueryString, stringifyQuery } from "utils/query-string";

/** useQueryString wraps useSearchParams and provides a way to interact and update all query params */
const useQueryString = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  console.log(searchParams.toString());
  const setQueryString = useCallback(
    (params: { [key: string]: any }) => {
      const stringifiedQuery = stringifyQuery(params);
      navigate(`?${stringifiedQuery}`, { replace: true });
    },
    [navigate]
  );
  return [searchParams, setQueryString] as const;
};

const useQueryParam = <T>(
  param: string,
  def: T
): readonly [T, (set: T) => void] => {
  const [searchParams, setSearchParams] = useQueryString();
  const setQueryParam = useCallback(
    (value: T) => {
      setSearchParams({
        ...parseQueryString(searchParams.toString()),
        [param]: value,
      });
    },
    [setSearchParams, searchParams, param]
  );

  if (Array.isArray(def)) {
    return [
      searchParams.get(param)?.split(",") as unknown as T,
      setQueryParam,
    ] as const;
  }
  return [
    (searchParams.get(param) as unknown as T) || def,
    setQueryParam,
  ] as const;
};

export { useQueryString, useQueryParam };
