import { useEffect, useState } from "react";
import { AutoSizer, List, ListProps, ListRowRenderer } from "react-virtualized";
import { QueryParams } from "constants/queryParams";
import { useLogContext } from "context/LogContext";
import { useQueryParam } from "hooks/useQueryParam";

type LogPaneProps = Omit<
  ListProps,
  "height" | "width" | "itemData" | "rowHeight"
> & {
  wrap: boolean;
  filters: string[];
  rowRenderer: ListRowRenderer;
  expandedLines: Array<[number, number]>;
};

const LogPane: React.FC<LogPaneProps> = ({
  rowRenderer,
  rowCount,
  cache,
  wrap,
  filters,
  expandedLines,
  ...rest
}) => {
  const [selectedLine] = useQueryParam<number | undefined>(
    QueryParams.SelectedLine,
    undefined
  );
  const [initialScrollIndex] = useState(selectedLine);

  const { listRef } = useLogContext();
  useEffect(() => {
    // Reset the cache and recalculate the row heights
    cache.clearAll();
    listRef.current?.recomputeRowHeights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wrap, `${filters}`, `${expandedLines}`]);

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
