import { useEffect, useRef } from "react";
import { AutoSizer, List, ListProps, ListRowRenderer } from "react-virtualized";

type LogPaneProps = Omit<
  ListProps,
  "height" | "width" | "itemData" | "rowHeight"
> & {
  wrap: boolean;
  filters: string[];
  rowRenderer: ListRowRenderer;
};

const LogPane: React.FC<LogPaneProps> = ({
  rowRenderer,
  logLines,
  rowCount,
  cache,
  wrap,
  filters,
  ...rest
}) => {
  const listRef = useRef<List>(null);
  useEffect(() => {
    // Reset the cache and recalculate the row heights
    cache.clearAll();
    listRef.current?.recomputeRowHeights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wrap, `${filters}`]);
  return (
    <AutoSizer>
      {({ height, width }) => (
        <List
          ref={listRef}
          containerStyle={{ overflow: "scroll visible" }}
          deferredMeasurementCache={cache}
          height={height}
          itemData={logLines}
          overscanRowCount={200}
          rowCount={rowCount}
          rowHeight={cache.rowHeight}
          rowRenderer={rowRenderer}
          scrollToAlignment="start"
          width={width}
          {...rest}
        />
      )}
    </AutoSizer>
  );
};

LogPane.displayName = "LogPane";

export default LogPane;
