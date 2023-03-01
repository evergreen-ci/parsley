import AnsiUp from "ansi_up";
import linkifyHtml from "linkify-html";
import BaseRow from "components/LogRow/BaseRow";
import { LogRowProps } from "../types";
import { isLineInRange } from "../utils";

interface AnsiiRowProps extends LogRowProps {
  lineNumber: number;
}

const AnsiiRow: React.FC<AnsiiRowProps> = (rowProps) => {
  const ansiUp = new AnsiUp();
  const {
    getLine,
    scrollToLine,
    highlightRegex,
    lineNumber,
    lineIndex,
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
      data-cy="ansii-row"
      highlights={highlightRegex}
      index={lineIndex}
      lineNumber={lineNumber}
      scrollToLine={scrollToLine}
      searchLine={searchLine}
      searchTerm={inRange ? searchTerm : undefined}
      wrap={wrap}
    >
      {linkifiedLine}
    </BaseRow>
  ) : null;
};

AnsiiRow.displayName = "AnsiiRow";

export default AnsiiRow;
