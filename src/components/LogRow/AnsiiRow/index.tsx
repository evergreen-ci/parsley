import { forwardRef } from "react";
import AnsiUp from "ansi_up";
import linkifyHtml from "linkify-html";
import BaseRow from "components/LogRow/BaseRow";
import { isExpanded } from "utils/expandedRanges";
import { BaseRowProps } from "../types";
import { isLineInRange } from "../utils";

const ansiUp = new AnsiUp();

const AnsiiRow = forwardRef<any, BaseRowProps>((rowProps, ref) => {
  const { data, listRowProps } = rowProps;
  const { index } = listRowProps;
  const {
    getLine,
    wrap,
    processedLines,
    searchTerm,
    range,
    highlightedLine,
    scrollToLine,
    expandedLines,
  } = data;

  const line = processedLines[index] as number;
  const expanded = isExpanded(line, expandedLines);

  const lineContent = getLine(line) || "";
  const linkifiedLine = linkifyHtml(ansiUp.ansi_to_html(lineContent), {
    validate: {
      url: (value: string) => /^(http)s?:\/\//.test(value),
    },
  });

  const inRange = isLineInRange(range, line);
  return lineContent ? (
    <BaseRow
      wrap={wrap}
      {...listRowProps}
      ref={ref}
      data-cy-text="ansii-row"
      expanded={expanded}
      highlightedLine={highlightedLine}
      lineNumber={line}
      scrollToLine={scrollToLine}
      searchTerm={inRange ? searchTerm : undefined}
    >
      {linkifiedLine}
    </BaseRow>
  ) : null;
});

AnsiiRow.displayName = "AnsiiRow";

export default AnsiiRow;
