import { forwardRef } from "react";
import AnsiUp from "ansi_up";
import linkifyHtml from "linkify-html";
import CollapsedRow from "components/LogRow//CollapsedRow";
import BaseRow from "components/LogRow/BaseRow";
import { isCollapsedRow } from "utils/collapsedRow";
import { BaseRowProps } from "../types";
import { isLineInRange } from "../utils";

const ansiUp = new AnsiUp();

const AnsiiRow = forwardRef<any, BaseRowProps>((rowProps, ref) => {
  const { data, listRowProps } = rowProps;
  const {
    getLine,
    wrap,
    processedLines,
    searchTerm,
    range,
    highlightedLine,
    scrollToLine,
  } = data;
  const { index } = listRowProps;

  const line = processedLines[index];

  if (isCollapsedRow(line)) {
    return (
      <CollapsedRow ref={ref} {...listRowProps} numCollapsed={line.length} />
    );
  }
  const lineContent = getLine(line) || "";
  const memoizedLogLine = linkifyHtml(ansiUp.ansi_to_html(lineContent), {
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
      highlightedLine={highlightedLine}
      lineNumber={line}
      scrollToLine={scrollToLine}
      searchTerm={inRange ? searchTerm : undefined}
    >
      {memoizedLogLine}
    </BaseRow>
  ) : null;
});

AnsiiRow.displayName = "AnsiiRow";

export default AnsiiRow;
