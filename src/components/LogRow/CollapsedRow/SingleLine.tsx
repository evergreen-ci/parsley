import React from "react";
import { LogTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import { useHighlightParam } from "hooks/useHighlightParam";
import AnsiRow from "../AnsiRow";
import ResmokeRow from "../ResmokeRow";

interface SingleLineProps {
  logType: string;
  index: number;
  lineNumber: number;
}
export const SingleLine: React.FC<SingleLineProps> = ({
  index,
  lineNumber,
  logType,
}) => {
  const {
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
  let Row;
  if (
    [
      LogTypes.EVERGREEN_TASK_FILE,
      LogTypes.EVERGREEN_TASK_LOGS,
      LogTypes.EVERGREEN_TEST_LOGS,
    ].includes(logType as LogTypes)
  ) {
    Row = AnsiRow;
  } else if (logType === LogTypes.RESMOKE_LOGS) {
    Row = ResmokeRow;
  } else {
    return null;
  }
  return (
    <Row
      getLine={getLine}
      getResmokeLineColor={getResmokeLineColor}
      highlightRegex={highlightRegex}
      lineIndex={index}
      lineNumber={lineNumber}
      prettyPrint={prettyPrint}
      range={range}
      scrollToLine={scrollToLine}
      searchLine={searchLine}
      searchTerm={searchRegex}
      wrap={wrap}
    />
  );
};
