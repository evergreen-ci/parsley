import React from "react";
import { AutoSizer, List, ListProps } from "react-virtualized";

type LogPaneProps = Omit<ListProps, "height" | "width" | "itemData"> & {
  logLines: string[];
  maxWidth: number;
};

const LogPane: React.FC<LogPaneProps> = ({
  maxWidth,
  rowRenderer,
  logLines,
  rowCount,
  rowHeight,
  cache,
  ...rest
}) => (
  <AutoSizer>
    {({ height, width }) => (
      <List
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
