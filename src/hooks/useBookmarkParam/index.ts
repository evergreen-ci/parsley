import { useCallback, useMemo } from "react";
import { QueryParams } from "constants/queryParams";
import { useQueryParams } from "hooks/useQueryParam";
import { conditionalCastToArray } from "utils/array";

/**
 * `useBookmarkParam` is a specialized form of useQueryParam. It needs to encode and decode the other query params to avoid conflicts caused by other query params exhibiting complex query param behavior
 */
const useBookmarkParam = () => {
  const [searchParams, setSearchParams] = useQueryParams({
    parseNumbers: false,
  });

  const bookmarks = searchParams[QueryParams.Bookmarks];
  const parsedBookmarks = useMemo(
    () =>
      conditionalCastToArray(bookmarks ?? [], true).map((b) =>
        b ? parseInt(b, 10) : 0
      ),
    [bookmarks]
  );

  const setBookmarkParam = useCallback(
    (newBookmarks: number[]) => {
      setSearchParams({
        ...searchParams,
        [QueryParams.Bookmarks]: newBookmarks,
      });
    },
    [setSearchParams, searchParams]
  );

  return [parsedBookmarks, setBookmarkParam] as const;
};

export { useBookmarkParam };
