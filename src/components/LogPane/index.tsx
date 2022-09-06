import React from "react";
import { AutoSizer, List, ListProps, ListRowRenderer } from "react-virtualized";

type LogPaneProps = Omit<
  ListProps,
  "height" | "width" | "itemData" | "rowHeight"
> & {
  wrap: boolean;
  rowRenderer: ListRowRenderer;
};

const LogPane: React.FC<LogPaneProps> = ({
  rowRenderer,
  logLines,
  rowCount,
  cache,
  wrap,
  ...rest
}) => (
  <AutoSizer>
    {({ height, width }) => (
      <List
        // If wrap is false, We want the list to scroll horizontally.
        containerStyle={wrap ? undefined : { overflowX: "scroll" }}
        deferredMeasurementCache={cache}
        height={height}
        itemData={logLines}
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

LogPane.displayName = "LogPane";

export default LogPane;
