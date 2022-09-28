import {
  CellMeasurer,
  CellMeasurerCache,
  ListRowProps,
  ListRowRenderer,
} from "react-virtualized";
import { LogTypes } from "constants/enums";
import AnsiiRow from "../AnsiiRow";
import ResmokeRow from "../ResmokeRow";
import { RowData } from "../types";

type RowRendererFunction = (data: RowData) => ListRowRenderer;

const RowRenderer: RowRendererFunction = (data) => {
  const { logType } = data;
  const Row = rowRendererMap[logType];
  const result = (props: ListRowProps) => {
    const { index, key, parent } = props;

    return (
      <CellMeasurer key={key} cache={cache} parent={parent} rowIndex={index}>
        {({ registerChild }) => (
          <Row ref={registerChild} data={data} listRowProps={props} />
        )}
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
