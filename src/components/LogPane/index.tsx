import { useEffect } from "react";
import PaginatedVirtualList from "components/PaginatedVirtualList";
import { QueryParams } from "constants/queryParams";
import { useLogContext } from "context/LogContext";
import { useQueryParam } from "hooks/useQueryParam";
import { leaveBreadcrumb } from "utils/errorReporting";
import { findLineIndex } from "utils/findLineIndex";

interface LogPaneProps {
  rowRenderer: (index: number) => React.ReactNode;
  rowCount: number;
}
const LogPane: React.FC<LogPaneProps> = ({ rowRenderer, rowCount }) => {
  const { processedLogLines, scrollToLine, listRef } = useLogContext();

  const [shareLine] = useQueryParam<number | undefined>(
    QueryParams.ShareLine,
    undefined
  );

  useEffect(() => {
    const initialScrollIndex = findLineIndex(processedLogLines, shareLine);
    if (initialScrollIndex > -1) {
      leaveBreadcrumb("Scrolled to initialScrollIndex", {
        initialScrollIndex,
      });
      scrollToLine(initialScrollIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PaginatedVirtualList
      ref={listRef}
      paginationOffset={50}
      paginationThreshold={500000}
      rowCount={rowCount}
      rowRenderer={rowRenderer}
    />
  );
};

LogPane.displayName = "VirtuosoLogPane";

export default LogPane;
