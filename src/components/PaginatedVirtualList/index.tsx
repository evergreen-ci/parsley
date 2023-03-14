import { useCallback, useEffect, useRef, useState } from "react";
import { ItemContent, Virtuoso, VirtuosoHandle } from "react-virtuoso";
import usePrevious from "hooks/usePrevious";
import { leaveBreadcrumb } from "utils/errorReporting";
import { calculatePageSize } from "./utils";

interface PaginatedVirtualListProps {
  count: number;
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
const PaginatedVirtualList: React.FC<PaginatedVirtualListProps> = ({
  count,
  rowRenderer,
  paginationThreshold = 10000,
  paginationOffset = 10,
}) => {
  if (paginationOffset >= paginationThreshold) {
    throw new Error("paginationOffset must be less than paginationThreshold");
  }
  const [currentPage, setCurrentPage] = useState(0);
  const prevPage = usePrevious(currentPage);
  const totalPageCount = Math.ceil(count / paginationThreshold);
  const offsetCompensation = currentPage > 0 ? -paginationOffset : 0;

  const pageSize = calculatePageSize(
    paginationThreshold,
    count,
    currentPage,
    paginationOffset
  );

  leaveBreadcrumb(
    "PaginatedVirtualList",
    {
      currentPage,
      totalPageCount,
      pageSize,
    },
    "process"
  );
  const listRef = useRef<VirtuosoHandle>(null);

  const scrollToNextPage = useCallback(() => {
    const nextPage = currentPage + 1;
    if (nextPage < totalPageCount) {
      setCurrentPage(nextPage);

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
    }
  }, [currentPage, paginationOffset, paginationThreshold, totalPageCount]);

  const scrollToPrevPage = useCallback(() => {
    const nextPage = currentPage - 1;
    if (currentPage !== 0) {
      setCurrentPage(nextPage);

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
  }, [
    currentPage,
    offsetCompensation,
    paginationOffset,
    paginationThreshold,
    totalPageCount,
  ]);

  useEffect(() => {
    if (prevPage === undefined) {
      return;
    }
    if (prevPage < currentPage) {
      listRef.current?.scrollIntoView({ index: paginationOffset });
    } else {
      listRef.current?.scrollIntoView({
        index: pageSize - paginationOffset,
        done: () => {
          console.log("done scrolling");
        },
      });
      setTimeout(() => {
        listRef.current?.scrollIntoView({
          index: pageSize - paginationOffset,
          done: () => {
            console.log("done scrolling");
          },
        });
      });
    }
  }, [currentPage]);

  // const offsetCompensation = shouldCompensateForOffset ? paginationOffset : 0;
  const startingIndex = currentPage * paginationThreshold + offsetCompensation;

  // itemContent maps the paginated index to the actual index in the list
  const itemContent = useCallback(
    (index: number) => {
      const lineIndex = index + startingIndex;

      return rowRenderer(lineIndex, undefined, undefined);
    },
    [rowRenderer, startingIndex]
  );

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
};

export default PaginatedVirtualList;
