import { useCallback, useRef, useState } from "react";
import { ItemContent, Virtuoso, VirtuosoHandle } from "react-virtuoso";

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
  const totalPageCount = Math.ceil(count / paginationThreshold);
  const linesOnPage = Math.min(
    paginationThreshold + paginationOffset,
    count - currentPage * paginationThreshold
  );

  const listRef = useRef<VirtuosoHandle>(null);

  const scrollToNextPage = useCallback(() => {
    const nextPage = currentPage + 1;
    if (nextPage < totalPageCount) {
      setCurrentPage(nextPage);
      const shouldCompensateForOffset = nextPage > 0;
      const offsetCompensation = shouldCompensateForOffset
        ? paginationOffset
        : 0;

      // Scroll by the paginationOffset to avoid the scroll event firing again
      // and causing an infinite loop
      listRef.current?.scrollToIndex(offsetCompensation);
    }
  }, [currentPage, paginationOffset, totalPageCount]);

  const scrollToPrevPage = useCallback(() => {
    const prevPage = currentPage - 1;
    if (currentPage !== 0) {
      setCurrentPage(prevPage);
      const shouldCompensateForOffset = currentPage > 0;

      const offsetCompensation = shouldCompensateForOffset
        ? paginationOffset
        : 0;

      // Scroll by the paginationOffset to avoid the scroll event firing again
      // and causing an infinite loop
      listRef.current?.scrollToIndex(linesOnPage - 1 - offsetCompensation);
      // listRef.current?.scrollToIndex(count);
    }
  }, [currentPage, linesOnPage, paginationOffset]);

  // const offsetCompensation = shouldCompensateForOffset ? paginationOffset : 0;
  const startingIndex = currentPage * paginationThreshold;

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
      totalCount={linesOnPage}
    />
  );
};

export default PaginatedVirtualList;
