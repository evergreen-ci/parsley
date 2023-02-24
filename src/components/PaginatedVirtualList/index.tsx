import { useCallback, useRef, useState } from "react";
import { ItemContent, Virtuoso, VirtuosoHandle } from "react-virtuoso";

interface PaginatedVirtualListProps {
  count: number;
  row: ItemContent<any, any>;
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
  row,
  paginationThreshold = 10000,
  paginationOffset = 10,
}) => {
  if (paginationOffset >= paginationThreshold) {
    throw new Error("paginationOffset must be less than paginationThreshold");
  }
  const [currentPage, setCurrentPage] = useState(0);
  const totalPageCount = Math.ceil(count / paginationThreshold);
  const linesOnPage = Math.min(
    paginationThreshold,
    count - currentPage * paginationThreshold
  );

  const listRef = useRef<VirtuosoHandle>(null);

  const scrollToNextPage = useCallback(() => {
    if (currentPage + 1 < totalPageCount) {
      setCurrentPage((prev) => prev + 1);
      // Scroll by the paginationOffset to avoid the scroll event firing again
      // and causing an infinite loop
      listRef.current?.scrollToIndex(paginationOffset);
    }
  }, [currentPage, paginationOffset, totalPageCount]);

  const scrollToPrevPage = useCallback(() => {
    if (currentPage !== 0) {
      setCurrentPage((prev) => prev - 1);
      // Scroll by the paginationOffset to avoid the scroll event firing again
      // and causing an infinite loop
      listRef.current?.scrollToIndex(linesOnPage - paginationOffset);
      // listRef.current?.scrollToIndex(count);
    }
  }, [currentPage, linesOnPage, paginationOffset]);

  // itemContent maps the paginated index to the actual index in the list
  const itemContent = useCallback(
    (index: number) => {
      const lineIndex = index + currentPage * paginationThreshold;

      return row(lineIndex, undefined, undefined);
    },
    [currentPage, paginationThreshold, row]
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
      itemContent={itemContent}
      style={{ height: "100%", width: "100%" }}
      totalCount={linesOnPage}
    />
  );
};

export default PaginatedVirtualList;
