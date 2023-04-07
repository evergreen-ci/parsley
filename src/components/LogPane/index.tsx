import { useEffect } from "react";
import PaginatedVirtualList from "components/PaginatedVirtualList";
import { CharKey } from "constants/keys";
import { QueryParams } from "constants/queryParams";
import { useLogContext } from "context/LogContext";
import { useKeyboardShortcut } from "hooks";
import { useQueryParam } from "hooks/useQueryParam";
import { leaveBreadcrumb } from "utils/errorReporting";
import { findLineIndex } from "utils/findLineIndex";

interface LogPaneProps {
  rowRenderer: (index: number) => React.ReactNode;
  rowCount: number;
}
const LogPane: React.FC<LogPaneProps> = ({ rowRenderer, rowCount }) => {
  const { processedLogLines, scrollToLine, listRef, lineCount } =
    useLogContext();

  const [shareLine] = useQueryParam<number | undefined>(
    QueryParams.ShareLine,
    undefined
  );

  useKeyboardShortcut({ charKey: CharKey.PageEnd }, () => {
    scrollToLine(lineCount - 1);
  });

  useKeyboardShortcut({ charKey: CharKey.PageHome }, () => {
    scrollToLine(0);
  });

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
