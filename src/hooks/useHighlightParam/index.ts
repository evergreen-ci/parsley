import { useCallback } from "react";
import { useQueryParams } from "hooks/useQueryParam";
import { conditionalToArray } from "utils/array";

/**
 * `useHighlightParam` is a specialized form of useQueryParam. It needs to encode and decode the highlights
 */
const useHighlightParam = () => {
  const [searchParams, setSearchParams] = useQueryParams();
  const parsedHighlights = conditionalToArray(
    searchParams.highlights ?? [],
    true
  ) as string[];

  const setHighlightsParam = useCallback(
    (newHighlights: string[]) => {
      setSearchParams({
        ...searchParams,
        highlights: newHighlights.map((highlight) =>
          // We need to encode the highlights twice because the URL will decode them once
          encodeURIComponent(encodeURIComponent(highlight))
        ),
      });
    },
    [setSearchParams, searchParams]
  );

  return [
    parsedHighlights.map((h) => decodeURIComponent(h)),
    setHighlightsParam,
  ] as const;
};

export { useHighlightParam };
