import { useCallback } from "react";
import { useQueryParams } from "hooks/useQueryParam";
import { Filters } from "types/logs";
import { conditionalToArray } from "utils/array";
import { parseFilters, stringifyFilters } from "utils/query-string";

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

export { useFilterParam };
