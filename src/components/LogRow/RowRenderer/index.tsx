import { Suspense, forwardRef, lazy } from "react";
import {
  CellMeasurer,
  CellMeasurerCache,
  ListRowProps,
  ListRowRenderer,
} from "react-virtualized";
import { LogTypes } from "constants/enums";
import ResmokeRow from "../ResmokeRow";
import { RowData } from "../types";

const AnsiiRow = lazy(() => import("../AnsiiRow"));

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

// We need to forward the ref to both the Row and the FallBackRow so that CellMeasurer can register the child
const SuspendedAnsiiRow = forwardRef(
  (props: React.ComponentProps<typeof AnsiiRow>, ref) => (
    // @ts-expect-error - ref is a valid prop for div
    <Suspense fallback={<div ref={ref}>Loading...</div>}>
      <AnsiiRow {...props} ref={ref} />
    </Suspense>
  )
);
SuspendedAnsiiRow.displayName = "SuspendedAnsiiRow";

const rowRendererMap = {
  [LogTypes.EVERGREEN_TASK_LOGS]: SuspendedAnsiiRow,
  [LogTypes.EVERGREEN_TEST_LOGS]: SuspendedAnsiiRow,
  [LogTypes.RESMOKE_LOGS]: ResmokeRow,
};

const cache = new CellMeasurerCache({
  fixedWidth: true,
  defaultHeight: 16,
});

export { RowRenderer, cache };
