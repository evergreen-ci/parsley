import React from "react";
import { AutoSizer, List, ListProps } from "react-virtualized";

type LogPaneProps = Omit<
  ListProps,
  "height" | "width" | "itemData" | "rowHeight"
> & {
  logLines: string[];
  wrap: boolean;
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
        // autoWidth
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
