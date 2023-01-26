import { useEffect } from "react";
import {
  AutoSizer,
  CellMeasurerCache,
  List,
  ListProps,
  ListRowRenderer,
} from "react-virtualized";
import { QueryParams } from "constants/queryParams";
import { useLogContext } from "context/LogContext";
import { useQueryParam } from "hooks/useQueryParam";
import { leaveBreadcrumb } from "utils/errorReporting";
import { findLineIndex } from "utils/findLineIndex";

type LogPaneProps = Omit<
  ListProps,
  "height" | "width" | "itemData" | "rowHeight"
> & {
  cache: CellMeasurerCache;
  rowRenderer: ListRowRenderer;
};

const LogPane: React.FC<LogPaneProps> = ({
  cache,
  rowRenderer,
  rowCount,
  ...rest
}) => {
  const {
    listRef,
    matchingLines,
    preferences,
    processedLogLines,
    scrollToLine,
  } = useLogContext();
  const { expandableRows, prettyPrint, wrap } = preferences;

  const [shareLine] = useQueryParam<number | undefined>(
    QueryParams.ShareLine,
    undefined
  );

  useEffect(() => {
    cache.clearAll();
    listRef.current?.recomputeRowHeights();
  }, [listRef, cache, wrap, matchingLines, expandableRows, prettyPrint]);

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
    <AutoSizer>
      {({ height, width }) => (
        <List
          ref={listRef}
          cache={cache}
          containerStyle={{
            overflow: "visible",
            minHeight: "100%",
          }}
          deferredMeasurementCache={cache}
          height={height}
          overscanRowCount={200}
          rowCount={rowCount}
          rowHeight={cache.rowHeight}
          rowRenderer={rowRenderer}
          scrollToAlignment="start"
          style={{
            overflowX: "scroll",
          }}
          width={width}
          {...rest}
        />
      )}
    </AutoSizer>
  );
};

LogPane.displayName = "LogPane";

export default LogPane;
