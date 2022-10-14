import { useEffect } from "react";
import { AutoSizer, List, ListProps, ListRowRenderer } from "react-virtualized";
import { useLogContext } from "context/LogContext";
import type { ParsedFilter } from "types/filters";

type LogPaneProps = Omit<
  ListProps,
  "height" | "width" | "itemData" | "rowHeight"
> & {
  filters: ParsedFilter[];
  filterLogic: string;
  initialScrollIndex: number;
  rowRenderer: ListRowRenderer;
  wrap: boolean;
};

const LogPane: React.FC<LogPaneProps> = ({
  rowRenderer,
  rowCount,
  cache,
  wrap,
  filterLogic,
  filters,
  initialScrollIndex,
  ...rest
}) => {
  const { listRef } = useLogContext();

  useEffect(() => {
    // Reset the cache and recalculate the row heights
    cache.clearAll();
    listRef.current?.recomputeRowHeights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wrap, filterLogic, JSON.stringify(filters)]);

  return (
    <AutoSizer>
      {({ height, width }) => (
        <List
          ref={listRef}
          containerStyle={{ overflow: "scroll visible" }}
          deferredMeasurementCache={cache}
          height={height}
          overscanRowCount={200}
          rowCount={rowCount}
          rowHeight={cache.rowHeight}
          rowRenderer={rowRenderer}
          scrollToAlignment="start"
          scrollToIndex={initialScrollIndex}
          width={width}
          {...rest}
        />
      )}
    </AutoSizer>
  );
};

LogPane.displayName = "LogPane";

export default LogPane;
