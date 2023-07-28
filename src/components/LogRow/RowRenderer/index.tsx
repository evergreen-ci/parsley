import { LogTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import { useHighlightParam } from "hooks/useHighlightParam";
import { ProcessedLogLines } from "types/logs";
import { isCollapsedRow } from "utils/collapsedRow";
import { getHighlightRegex, getSearchRegex } from "utils/regex";
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
    preferences,
    range,
    scrollToLine,
    searchLine,
    searchState,
  } = useLogContext();
  const { prettyPrint, wrap } = preferences;

  const { searchTerm } = searchState;
  const searchTermRegex = getSearchRegex(searchTerm);

  const [highlights] = useHighlightParam();
  const highlightRegex = getHighlightRegex(highlights);

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
