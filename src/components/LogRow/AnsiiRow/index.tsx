import { forwardRef } from "react";
import AnsiUp from "ansi_up";
import linkifyHtml from "linkify-html";
import BaseRow from "components/LogRow/BaseRow";
import { BaseRowProps } from "../types";
import { isLineInRange } from "../utils";

const ansiUp = new AnsiUp();

interface AnsiiRowProps extends BaseRowProps {
  lineNumber: number;
}

const AnsiiRow = forwardRef<any, AnsiiRowProps>((rowProps, ref) => {
  const { data, listRowProps, lineNumber } = rowProps;
  const {
    getLine,
    resetRowHeightAtIndex,
    scrollToLine,
    highlightedLine,
    range,
    searchTerm,
    wrap,
  } = data;

  const lineContent = getLine(lineNumber) || "";
  const linkifiedLine = linkifyHtml(ansiUp.ansi_to_html(lineContent), {
    validate: {
      url: (value: string) => /^(http)s?:\/\//.test(value),
    },
  });
  const inRange = isLineInRange(range, lineNumber);

  return lineContent ? (
    <BaseRow
      {...listRowProps}
      ref={ref}
      data-cy="ansii-row"
      highlightedLine={highlightedLine}
      lineNumber={lineNumber}
      resetRowHeightAtIndex={resetRowHeightAtIndex}
      scrollToLine={scrollToLine}
      searchTerm={inRange ? searchTerm : undefined}
      wrap={wrap}
    >
      {linkifiedLine}
    </BaseRow>
  ) : null;
});

AnsiiRow.displayName = "AnsiiRow";

export default AnsiiRow;
