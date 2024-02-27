import { LogRenderingTypes, LogTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import { useHighlightParam } from "hooks/useHighlightParam";
import { ProcessedLogLines } from "types/logs";
import { isCollapsedRow } from "utils/collapsedRow";
import AnsiRow from "../AnsiRow";
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
    logMetadata,
    preferences,
    range,
    scrollToLine,
    searchLine,
    searchState,
  } = useLogContext();
  const { prettyPrint, wordWrapFormat, wrap } = preferences;

  const { searchTerm } = searchState;
  const searchRegex = searchTerm
    ? new RegExp(`(${searchTerm.source})`, searchTerm.ignoreCase ? "gi" : "g")
    : undefined;

  // Join the highlights into a single regex to match against. Use capture groups
  // to highlight each match.
  const [highlights] = useHighlightParam();
  const highlightRegex =
    highlights.length > 0
      ? new RegExp(`${highlights.map((h) => `(${h})`).join("|")}`, "gi")
      : undefined;

  let Row: typeof ResmokeRow | typeof AnsiRow;
  // At this point, logMetadata is defined from <LoadingPage />
  switch (logMetadata?.renderingType) {
    case LogRenderingTypes.Resmoke:
      Row = ResmokeRow;
      break;
    case LogRenderingTypes.Default:
      Row = AnsiRow;
      break;
    default:
      Row = AnsiRow;
      break;
  }

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
        searchTerm={searchRegex}
        wordWrapFormat={wordWrapFormat}
        wrap={wrap}
      />
    );
  };

  result.displayName = `${logType}RowRenderer`;
  return result;
};

export { ParsleyRow };
