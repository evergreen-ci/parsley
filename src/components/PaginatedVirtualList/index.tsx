import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { ItemContent, Virtuoso, VirtuosoHandle } from "react-virtuoso";
import usePrevious from "hooks/usePrevious";
import { leaveBreadcrumb } from "utils/errorReporting";
import { PaginatedVirtualListRef } from "./types";
import { calculatePageSize } from "./utils";

interface PaginatedVirtualListProps {
  rowCount: number;
  rowRenderer: ItemContent<any, any>;
  /**
   * The number of lines to render on each page.
   */
  paginationThreshold?: number;
  /**
   * The number of lines to scroll by when the user scrolls to the next page.
   * This is used to avoid the scroll event firing again and causing an infinite loop.
   * This value must be less than paginationThreshold.
   */
  paginationOffset?: number;
}

const PaginatedVirtualList = forwardRef<
  PaginatedVirtualListRef,
  PaginatedVirtualListProps
>((props, ref) => {
  const {
    rowCount,
    rowRenderer,
    paginationThreshold = 10000,
    paginationOffset = 10,
  } = props;
  if (paginationOffset >= paginationThreshold) {
    throw new Error("paginationOffset must be less than paginationThreshold");
  }
  const [currentPage, setCurrentPage] = useState(0);
  const prevPage = usePrevious(currentPage);
  const totalPageCount = Math.ceil(rowCount / paginationThreshold);
  const offsetCompensation = currentPage > 0 ? -paginationOffset : 0;

  const pageSize = calculatePageSize({
    maxPageSize: paginationThreshold,
    totalItemCount: rowCount,
    currentPage,
    offset: paginationOffset,
  });

  const listRef = useRef<VirtuosoHandle>(null);

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

  useEffect(() => {
    if (prevPage === undefined) {
      return;
    }
    if (prevPage < currentPage) {
      // If we're scrolling to the next page, we want to scroll to the top of the next page
      listRef.current?.scrollToIndex({
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
        listRef.current?.scrollToIndex({
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

  const startingIndex = currentPage * paginationThreshold + offsetCompensation;

  // itemContent maps the paginated index to the actual index in the list
  const itemContent = useCallback(
    (index: number) => {
      const lineIndex = index + startingIndex;

      return rowRenderer(lineIndex, undefined, undefined);
    },
    [rowRenderer, startingIndex]
  );

  const scrollToIndex = useCallback(
    (index: number) => {
      const page = Math.floor(index / paginationThreshold);
      if (page !== currentPage) {
        setCurrentPage(page);
      }
      const indexToScrollTo = currentPage === 0 ? index : startingIndex - index;
      listRef.current?.scrollToIndex({
        index: indexToScrollTo,
        align: "start",
      });
    },
    [paginationThreshold, startingIndex, currentPage]
  );

  // Expose scrollToIndex as a ref
  useEffect(() => {
    if (ref) {
      // eslint-disable-next-line no-param-reassign
      (ref as any).current = {
        scrollToIndex,
      };
    }
  }, [ref, scrollToIndex]);

  return (
    <Virtuoso
      ref={listRef}
      atBottomStateChange={(val) => {
        if (val) {
          scrollToNextPage();
        }
      }}
      atTopStateChange={(val) => {
        if (val) {
          scrollToPrevPage();
        }
      }}
      data-cy="paginated-virtual-list"
      itemContent={itemContent}
      overscan={300}
      totalCount={pageSize}
    />
  );
});

PaginatedVirtualList.displayName = "PaginatedVirtualList";

export default PaginatedVirtualList;
