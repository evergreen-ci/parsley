import { forwardRef, useCallback, useEffect, useRef } from "react";
import { ItemContent, Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { CharKey } from "constants/keys";
import { useKeyboardShortcut } from "hooks";
import { PaginatedVirtualListRef } from "./types";
import usePaginatedVirtualList from "./usePaginatedVirtualList";

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
  className?: string;
}

const PaginatedVirtualList = forwardRef<
  PaginatedVirtualListRef,
  PaginatedVirtualListProps
>(
  (
    {
      className,
      paginationOffset = 10,
      paginationThreshold = 10000,
      rowCount,
      rowRenderer,
    },
    ref,
  ) => {
    if (paginationOffset >= paginationThreshold) {
      throw new Error("paginationOffset must be less than paginationThreshold");
    }

    const listRef = useRef<VirtuosoHandle>(null);

    const {
      pageSize,
      scrollToLine,
      scrollToNextPage,
      scrollToPrevPage,
      startingIndex,
    } = usePaginatedVirtualList({
      paginationOffset,
      paginationThreshold,
      ref: listRef,
      rowCount,
    });

    useKeyboardShortcut({ charKey: CharKey.PageEnd }, () => {
      scrollToLine(rowCount - 1);
    });

    useKeyboardShortcut({ charKey: CharKey.PageHome }, () => {
      scrollToLine(0);
    });

    // itemContent maps the paginated index to the actual index in the list
    const itemContent = useCallback(
      (index: number) => {
        const lineIndex = index + startingIndex;

        return rowRenderer(lineIndex, undefined, undefined);
      },
      [rowRenderer, startingIndex],
    );

    // Expose scrollToIndex as a ref
    useEffect(() => {
      if (ref) {
        // eslint-disable-next-line no-param-reassign
        (ref as any).current = {
          scrollToIndex: scrollToLine,
        } satisfies PaginatedVirtualListRef;
      }
    }, [ref, scrollToLine]);

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
        className={className}
        data-cy="paginated-virtual-list"
        itemContent={itemContent}
        overscan={300}
        totalCount={pageSize}
      />
    );
  },
);

PaginatedVirtualList.displayName = "PaginatedVirtualList";

export default PaginatedVirtualList;
