import { useCallback, useMemo } from "react";
import { useQueryParams } from "hooks/useQueryParam";
import { conditionalCastToArray } from "utils/array";

/**
 * `useHighlightParam` is a specialized form of useQueryParam. It needs to encode and decode the highlights
 */
const useHighlightParam = () => {
  const [searchParams, setSearchParams] = useQueryParams({
    parseNumbers: false,
  });

  const parsedHighlights = useMemo(
    () =>
      (
        conditionalCastToArray(searchParams.highlights ?? [], true) as string[]
      ).map((h) => decodeURIComponent(h)),
    [searchParams.highlights]
  );

  const setHighlightsParam = useCallback(
    (newHighlights: string[]) => {
      setSearchParams({
        ...searchParams,
        highlights: newHighlights.map((highlight) =>
          // We need to encode the highlights twice because the URL will decode them once
          encodeURIComponent(highlight)
        ),
      });
    },
    [setSearchParams, searchParams]
  );

  return [parsedHighlights, setHighlightsParam] as const;
};

export { useHighlightParam };
