import { useEffect } from "react";
import Cookies from "js-cookie";
import PaginatedVirtualList from "components/PaginatedVirtualList";
import { WRAP } from "constants/cookies";
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
  const { listRef, preferences, processedLogLines, scrollToLine } =
    useLogContext();
  const { setWrap } = preferences;

  const [shareLine] = useQueryParam<number | undefined>(
    QueryParams.ShareLine,
    undefined
  );

  useEffect(() => {
    if (listRef.current) {
      // Use a timeout to execute certain actions after the log pane has rendered. All of the
      // code below describes one-time events.
      setTimeout(() => {
        const initialScrollIndex = findLineIndex(processedLogLines, shareLine);
        if (initialScrollIndex > -1) {
          leaveBreadcrumb(
            "Triggered scroll to shareLine",
            { initialScrollIndex, shareLine },
            "user"
          );
          scrollToLine(initialScrollIndex);
        } else {
          leaveBreadcrumb(
            "shareLine not provided or found in processedLogLines",
            { shareLine },
            "process"
          );
        }

        // Wrap can be enabled after the log pane has initially loaded.
        if (Cookies.get(WRAP) === "true") {
          setWrap(true);
        }
      }, 50);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listRef]);

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
