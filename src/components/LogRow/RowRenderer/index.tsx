import {
  CellMeasurer,
  CellMeasurerCache,
  ListRowProps,
  ListRowRenderer,
} from "react-virtualized";
import { LogTypes } from "constants/enums";
import { ProcessedLogLines } from "types/logs";
import { isCollapsedRow } from "utils/collapsedRow";
import AnsiiRow from "../AnsiiRow";
import CollapsedRow from "../CollapsedRow";
import ResmokeRow from "../ResmokeRow";
import { RowData } from "../types";

type RowRendererFunction = (props: {
  data: RowData;
  processedLogLines: ProcessedLogLines;
  logType: LogTypes;
}) => ListRowRenderer;

const RowRenderer: RowRendererFunction = (props) => {
  const { logType, processedLogLines, data } = props;

  const result = (listRowProps: ListRowProps) => {
    const { index, key, parent } = listRowProps;

    return (
      <CellMeasurer key={key} cache={cache} parent={parent} rowIndex={index}>
        {({ registerChild }) => {
          if (isCollapsedRow(processedLogLines[index])) {
            return (
              <CollapsedRow
                ref={registerChild}
                collapsedLines={processedLogLines[index] as number[]}
                data={data}
                listRowProps={listRowProps}
              />
            );
          }
          const Row = rowRendererMap[logType];
          return (
            <Row
              ref={registerChild}
              data={data}
              lineNumber={processedLogLines[index] as number}
              listRowProps={listRowProps}
            />
          );
        }}
      </CellMeasurer>
    );
  };
  result.displayName = `${logType}RowRenderer`;
  return result;
};

const rowRendererMap = {
  [LogTypes.EVERGREEN_TASK_LOGS]: AnsiiRow,
  [LogTypes.EVERGREEN_TEST_LOGS]: AnsiiRow,
  [LogTypes.RESMOKE_LOGS]: ResmokeRow,
};

const cache = new CellMeasurerCache({
  fixedWidth: true,
  defaultHeight: 16,
});

export { RowRenderer, cache };
