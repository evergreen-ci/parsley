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
const LogPane: React.FC<LogPaneProps> = ({ rowCount, rowRenderer }) => {
  const { listRef, processedLogLines, scrollToLine } = useLogContext();

  const [shareLine] = useQueryParam<number | undefined>(
    QueryParams.ShareLine,
    undefined
  );

  useEffect(() => {
    const initialScrollIndex = findLineIndex(processedLogLines, shareLine);
    if (initialScrollIndex > -1) {
      leaveBreadcrumb("Triggered scroll to shareLine", {
        initialScrollIndex,
        shareLine,
      });
      // This timeout is necessary to ensure that the list has been rendered
      // before we try to scroll to the line.
      setTimeout(() => {
        scrollToLine(initialScrollIndex);
      }, 50);
    } else {
      leaveBreadcrumb("shareLine not provided or found in processedLogLines", {
        shareLine,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PaginatedVirtualList
      ref={listRef}
      paginationOffset={200}
      paginationThreshold={500000}
      rowCount={rowCount}
      rowRenderer={rowRenderer}
    />
  );
};

LogPane.displayName = "VirtuosoLogPane";

export default LogPane;
