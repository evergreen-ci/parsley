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

type LogPaneProps = Omit<
  ListProps,
  "height" | "width" | "itemData" | "rowHeight"
> & {
  cache: CellMeasurerCache;
  initialScrollIndex: number;
  rowRenderer: ListRowRenderer;
};

const LogPane: React.FC<LogPaneProps> = ({
  cache,
  rowRenderer,
  rowCount,
  initialScrollIndex,
  ...rest
}) => {
  const { listRef, matchingLines } = useLogContext();

  const [wrap] = useQueryParam(QueryParams.Wrap, false);
  const [expandableRows] = useQueryParam(QueryParams.Expandable, true);

  useEffect(() => {
    cache.clearAll();
    listRef.current?.recomputeRowHeights();
  }, [listRef, cache, wrap, matchingLines, expandableRows]);

  return (
    <AutoSizer>
      {({ height, width }) => (
        <List
          ref={listRef}
          cache={cache}
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
