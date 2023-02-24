import {
  CellMeasurer,
  CellMeasurerCache,
  ListRowProps,
  ListRowRenderer,
} from "react-virtualized";
import { LogTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import { useHighlightParam } from "hooks/useHighlightParam";
import { ProcessedLogLines } from "types/logs";
import { isCollapsedRow } from "utils/collapsedRow";
import AnsiiRow from "../AnsiiRow";
import CollapsedRow from "../CollapsedRow";
import ResmokeRow from "../ResmokeRow";

type RowRendererFunction = (props: {
  processedLogLines: ProcessedLogLines;
  logType: LogTypes;
}) => ListRowRenderer;

const RowRenderer: RowRendererFunction = (props) => {
  const { logType, processedLogLines } = props;
  const {
    expandLines,
    getLine,
    getResmokeLineColor,
    resetRowHeightAtIndex,
    scrollToLine,
    preferences,
    range,
    searchLine,
    searchState,
  } = useLogContext();
  const { searchTerm } = searchState;
  const { wrap, prettyPrint } = preferences;

  const [highlights] = useHighlightParam();
  // Join the highlights into a single regex to match against. Use capture groups
  // to highlight each match.
  const highlightRegex =
    highlights.length > 0
      ? new RegExp(`${highlights.map((h) => `(${h})`).join("|")}`, "gi")
      : undefined;

  const result = (listRowProps: ListRowProps) => {
    const { index, key, parent } = listRowProps;

    return (
      <CellMeasurer key={key} cache={cache} parent={parent} rowIndex={index}>
        {({ registerChild }) => {
          const processedLogLine = processedLogLines[index];
          if (isCollapsedRow(processedLogLine)) {
            return (
              <CollapsedRow
                ref={registerChild}
                collapsedLines={processedLogLine}
                expandLines={expandLines}
                listRowProps={listRowProps}
              />
            );
          }
          const Row = rowRendererMap[logType];
          return (
            <Row
              ref={registerChild}
              getLine={getLine}
              getResmokeLineColor={getResmokeLineColor}
              highlightRegex={highlightRegex}
              lineNumber={processedLogLine}
              listRowProps={listRowProps}
              prettyPrint={prettyPrint}
              range={range}
              resetRowHeightAtIndex={resetRowHeightAtIndex}
              scrollToLine={scrollToLine}
              searchLine={searchLine}
              searchTerm={searchTerm}
              wrap={wrap}
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
  defaultHeight: 18,
});

export { RowRenderer, cache };
