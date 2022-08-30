import React from "react";
import { AutoSizer, List, ListProps } from "react-virtualized";

type LogPaneProps = Omit<ListProps, "height" | "width" | "itemData"> & {
  logLines: string[];
};

const LogPane: React.FC<LogPaneProps> = ({
  rowRenderer,
  logLines,
  rowCount,
  rowHeight,
}) => (
  <AutoSizer>
    {({ height, width }) => (
      <List
        height={height}
        itemData={logLines}
        rowCount={rowCount}
        rowHeight={rowHeight}
        rowRenderer={rowRenderer}
        width={width}
      />
    )}
  </AutoSizer>
);

LogPane.displayName = "LogPane";

export default LogPane;
