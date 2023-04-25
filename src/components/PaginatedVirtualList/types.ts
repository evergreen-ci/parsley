import { ItemContent } from "react-virtuoso";

type RowRenderer = (index: number) => ItemContent<any, any>;

interface PaginatedVirtualListRef {
  scrollToIndex: (index: number) => void;
}

export type { RowRenderer, PaginatedVirtualListRef };
