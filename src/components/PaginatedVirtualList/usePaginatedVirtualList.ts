import { useCallback, useEffect, useState } from "react";
import { VirtuosoHandle } from "react-virtuoso";
import usePrevious from "hooks/usePrevious";
import { leaveBreadcrumb } from "utils/errorReporting";
import { calculatePageSize } from "./utils";

interface UsePaginatedVirtualListProps {
  rowCount: number;
  paginationThreshold: number;
  paginationOffset: number;
  ref: React.RefObject<Pick<VirtuosoHandle, "scrollToIndex">>;
}

const usePaginatedVirtualList = ({
  rowCount,
  paginationOffset,
  paginationThreshold,
  ref,
}: UsePaginatedVirtualListProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const prevPage = usePrevious(currentPage);
  const totalPageCount = Math.ceil(rowCount / paginationThreshold);
  const offsetCompensation = currentPage > 0 ? paginationOffset : 0;

  const pageSize = calculatePageSize({
    maxPageSize: paginationThreshold,
    totalItemCount: rowCount,
    currentPage,
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

  // The following useEffect is necessary to scroll to the correct position when the user
  // scrolls to the next or previous page.
  useEffect(() => {
    if (prevPage === undefined) {
      return;
    }
    if (prevPage < currentPage) {
      // If we're scrolling to the next page, we want to scroll to the top of the next page
      ref.current?.scrollToIndex({
        index: paginationOffset,
        align: "end",
      });
      leaveBreadcrumb(
        "PaginatedVirtualList",
        {
          message: "scrollToNextPage",
          paginationOffset,
          paginationThreshold,
          currentPage,
          totalPageCount,
        },
        "process"
      );
    } else {
      // This setTimeout is necessary because the first scroll doesn't always work
      // I'm not sure why, but this seems to fix it ¯\_(ツ)_/¯
      setTimeout(() => {
        ref.current?.scrollToIndex({
          index: pageSize - paginationOffset,
          align: "start",
        });
      });
      leaveBreadcrumb(
        "PaginatedVirtualList",
        {
          message: "scrollToPrevPage",
          offsetCompensation,
          paginationOffset,
          paginationThreshold,
          currentPage,
          totalPageCount,
        },
        "process"
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // startingIndex is the index of the first item in the list with respect to the visible page
  const startingIndex = currentPage * paginationThreshold - offsetCompensation;

  const scrollToLine = useCallback(
    (index: number) => {
      const page = Math.floor(index / paginationThreshold);
      if (page !== currentPage) {
        setCurrentPage(page);
      }
      const indexToScrollTo =
        currentPage === 0 ? index : Math.abs(startingIndex - index);
      leaveBreadcrumb(
        "PaginatedVirtualList",
        {
          message: "scrollToIndex",
          index,
          indexToScrollTo,
          newPage: page,
          currentPage,
          paginationThreshold,
          paginationOffset,
          startingIndex,
        },
        "process"
      );
      ref.current?.scrollToIndex({
        index: indexToScrollTo,
        align: "start",
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [paginationOffset, currentPage, startingIndex]
  );

  return {
    scrollToNextPage,
    scrollToPrevPage,
    startingIndex,
    pageSize: pageSize + offsetCompensation,
    scrollToLine,
    currentPage,
  };
};

export default usePaginatedVirtualList;
