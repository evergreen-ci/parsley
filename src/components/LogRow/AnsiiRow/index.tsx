import { forwardRef, useMemo } from "react";
import AnsiUp from "ansi_up";
import linkifyHtml from "linkify-html";
import Highlight from "components/Highlight";
import CollapsedRow from "components/LogRow//CollapsedRow";
import BaseRow from "components/LogRow/BaseRow";
import renderHtml from "utils/renderHtml";
import { BaseRowProps } from "../types";

const ansiUp = new AnsiUp();

const AnsiiRow = forwardRef<any, BaseRowProps>((rowProps, ref) => {
  const { data, listRowProps } = rowProps;
  const { getLine, wrap, processedLines, searchTerm } = data;
  const { index } = listRowProps;

  const line = processedLines[index];

  if (Array.isArray(line)) {
    return (
      <CollapsedRow ref={ref} {...listRowProps} numCollapsed={line.length} />
    );
  }
  const lineContent = getLine(line);
  return lineContent ? (
    <BaseRow wrap={wrap} {...listRowProps} ref={ref} lineNumber={line}>
      <ProcessedAnsiiRow lineContent={lineContent} searchTerm={searchTerm} />
    </BaseRow>
  ) : null;
});

interface ProcessedAnsiiRowProps {
  lineContent: string;
  searchTerm?: RegExp;
}
const ProcessedAnsiiRow: React.FC<ProcessedAnsiiRowProps> = ({
  lineContent,
  searchTerm,
}) => {
  const memoizedLogLine = useMemo(() => {
    let render = linkifyHtml(ansiUp.ansi_to_html(lineContent), {
      validate: {
        url: (value: string) => /^(http)s?:\/\//.test(value),
      },
    });
    if (searchTerm) {
      render = render.replace(searchTerm, `<mark>$&</mark>`);
    }
    return renderHtml(render, {
      transform: {
        // @ts-expect-error - This is expecting a react component but its an Emotion component which are virtually the same thing
        mark: Highlight,
      },
    });
  }, [lineContent, searchTerm]);
  return <span data-cy="ansii-row">{memoizedLogLine}</span>;
};

AnsiiRow.displayName = "AnsiiRow";

export default AnsiiRow;
