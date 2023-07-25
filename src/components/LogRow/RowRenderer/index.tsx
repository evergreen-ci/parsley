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
}) => (index: number) => JSX.Element;

const ParsleyRow: RowRendererFunction = ({ logType, processedLogLines }) => {
  const {
    expandLines,
    getLine,
    getResmokeLineColor,
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
      ? new RegExp(
          `${highlights.map((h) => `(${h})(?![^<]*>)`).join("|")}`,
          "gi"
        )
      : undefined;

  const searchTermRegex = searchTerm
    ? new RegExp(
        `(${searchTerm.source})(?![^<]*>)`,
        searchTerm.ignoreCase ? "gi" : "g"
      )
    : undefined;

  const result = (index: number) => {
    const processedLogLine = processedLogLines[index];
    if (isCollapsedRow(processedLogLine)) {
      return (
        <CollapsedRow
          collapsedLines={processedLogLine}
          expandLines={expandLines}
          lineIndex={index}
        />
      );
    }
    const Row = rowRendererMap[logType];
    return (
      <Row
        getLine={getLine}
        getResmokeLineColor={getResmokeLineColor}
        highlightRegex={highlightRegex}
        lineIndex={index}
        lineNumber={processedLogLine}
        prettyPrint={prettyPrint}
        range={range}
        scrollToLine={scrollToLine}
        searchLine={searchLine}
        searchTerm={searchTermRegex}
        wrap={wrap}
      />
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

export { ParsleyRow };
