import { useCallback, useEffect, useRef, useState } from "react";
import { VirtuosoHandle } from "react-virtuoso";
import usePrevious from "hooks/usePrevious";
import { SentryBreadcrumb, leaveBreadcrumb } from "utils/errorReporting";
import { calculatePageSize, calculateStartingIndex } from "./utils";

interface UsePaginatedVirtualListProps {
  rowCount: number;
  paginationThreshold: number;
  paginationOffset: number;
  ref: React.RefObject<Pick<VirtuosoHandle, "scrollToIndex">>;
}

const usePaginatedVirtualList = ({
  paginationOffset,
  paginationThreshold,
  ref,
  rowCount,
}: UsePaginatedVirtualListProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const prevPage = usePrevious(currentPage);
  const totalPageCount = Math.ceil(rowCount / paginationThreshold);

  // isScrollerScroll is used to prevent the list from automatically adjusting the scroll position
  // when jumpToLine is called. This is necessary because the list will automatically scroll to the
  // top of the page when the user scrolls to the next or previous page. We don't want to scroll to
  // the top of the page when jumpToLine is called, so we use this flag to prevent that from happening.
  const isScrollerScroll = useRef(true);

  const offsetCompensation = currentPage > 0 ? paginationOffset : 0;

  const pageSize = calculatePageSize({
    currentPage,
    maxPageSize: paginationThreshold,
    totalItemCount: rowCount,
  });

  const scrollToNextPage = useCallback(() => {
    const nextPage = currentPage + 1;
    if (nextPage < totalPageCount) {
      setCurrentPage(nextPage);
    }
  }, [currentPage, totalPageCount]);

  const scrollToPrevPage = useCallback(() => {
    const nextPage = currentPage - 1;
    if (currentPage !== 0) {
      setCurrentPage(nextPage);
    }
  }, [currentPage]);

  // Reset the page to 0 if the row count is less than a page length, but we're not on the first page (e.g. if a filter is applied that significantly shortens the row count).
  useEffect(() => {
    if (rowCount < paginationThreshold && currentPage !== 0) {
      setCurrentPage(0);
    }
  }, [currentPage, paginationThreshold, rowCount]);

  // The following useEffect is necessary to scroll to the correct position when the user
  // scrolls to the next or previous page.
  useEffect(() => {
    if (prevPage === undefined || isScrollerScroll.current) {
      isScrollerScroll.current = false;
      return;
    }
    if (prevPage < currentPage) {
      // If we're scrolling to the next page, we want to scroll to the top of the next page
      ref.current?.scrollToIndex({
        align: "end",
        index: paginationOffset,
      });
      leaveBreadcrumb(
        "PaginatedVirtualList",
        {
          currentPage,
          message: "scrollToNextPage",
          paginationOffset,
          paginationThreshold,
          totalPageCount,
        },
        SentryBreadcrumb.UI,
      );
    } else {
      // This setTimeout is necessary because the first scroll doesn't always work
      // I'm not sure why, but this seems to fix it ¯\_(ツ)_/¯
      setTimeout(() => {
        ref.current?.scrollToIndex({
          align: "start",
          index: pageSize - paginationOffset,
        });
      });
      leaveBreadcrumb(
        "PaginatedVirtualList",
        {
          currentPage,
          message: "scrollToPrevPage",
          offsetCompensation,
          paginationOffset,
          paginationThreshold,
          totalPageCount,
        },
        SentryBreadcrumb.UI,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // startingIndex is the index of the first item in the list with respect to the visible page
  const startingIndex = currentPage * paginationThreshold - offsetCompensation;

  const scrollToLine = useCallback(
    (index: number) => {
      const nextPage = Math.floor(index / paginationThreshold);
      if (nextPage !== currentPage) {
        setCurrentPage(nextPage);
        isScrollerScroll.current = true;
      }
      const nextScrollIndex =
        index -
        calculateStartingIndex({
          page: nextPage,
          paginationOffset,
          paginationThreshold,
        });

      leaveBreadcrumb(
        "PaginatedVirtualList",
        {
          currentPage,
          index,
          message: "scrollToIndex",
          nextPage,
          nextScrollIndex,
          paginationOffset,
          paginationThreshold,
          startingIndex,
        },
        SentryBreadcrumb.UI,
      );
      // This setTimeout is necessary to avoid a race condition where the list hasn't finished rendering the next page
      setTimeout(() => {
        ref.current?.scrollToIndex({
          align: "start",
          index: nextScrollIndex,
        });
      }, 0);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [paginationOffset, currentPage, startingIndex],
  );

  return {
    currentPage,
    pageSize: pageSize + offsetCompensation,
    scrollToLine,
    scrollToNextPage,
    scrollToPrevPage,
    startingIndex,
  };
};

export default usePaginatedVirtualList;
