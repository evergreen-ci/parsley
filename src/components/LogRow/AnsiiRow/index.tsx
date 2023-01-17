import { forwardRef } from "react";
import AnsiUp from "ansi_up";
import linkifyHtml from "linkify-html";
import BaseRow from "components/LogRow/BaseRow";
import { LogRowProps } from "../types";
import { isLineInRange } from "../utils";

interface AnsiiRowProps extends LogRowProps {
  lineNumber: number;
}

const AnsiiRow = forwardRef<any, AnsiiRowProps>((rowProps, ref) => {
  const ansiUp = new AnsiUp();
  const {
    getLine,
    resetRowHeightAtIndex,
    scrollToLine,
    highlightRegex,
    lineNumber,
    listRowProps,
    range,
    searchLine,
    searchTerm,
    wrap,
  } = rowProps;

  const lineContent = getLine(lineNumber);
  const linkifiedLine = linkifyHtml(ansiUp.ansi_to_html(lineContent ?? ""), {
    validate: {
      url: (value: string) => /^(http)s?:\/\//.test(value),
    },
  });
  const inRange = isLineInRange(range, lineNumber);

  return lineContent !== undefined ? (
    <BaseRow
      {...listRowProps}
      ref={ref}
      data-cy="ansii-row"
      highlights={highlightRegex}
      lineNumber={lineNumber}
      resetRowHeightAtIndex={resetRowHeightAtIndex}
      scrollToLine={scrollToLine}
      searchLine={searchLine}
      searchTerm={inRange ? searchTerm : undefined}
      wrap={wrap}
    >
      {linkifiedLine}
    </BaseRow>
  ) : null;
});

AnsiiRow.displayName = "AnsiiRow";

export default AnsiiRow;
