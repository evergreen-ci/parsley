import { forwardRef, useMemo } from "react";
import AnsiUp from "ansi_up";
import parse from "html-react-parser";
import linkifyHtml from "linkify-html";
import CollapsedRow from "components/LogRow//CollapsedRow";
import BaseRow from "components/LogRow/BaseRow";
import { BaseRowProps } from "../types";

const ansiUp = new AnsiUp();

const AnsiiRow = forwardRef<any, BaseRowProps>((rowProps, ref) => {
  const { data, listRowProps } = rowProps;
  const { getLine, setScrollIndex, wrap, processedLines } = data;
  const { index } = listRowProps;

  const line = processedLines[index];

  if (Array.isArray(line)) {
    return (
      <CollapsedRow ref={ref} {...listRowProps} numCollapsed={line.length} />
    );
  }
  const lineContent = getLine(line);
  return lineContent ? (
    <BaseRow
      {...listRowProps}
      ref={ref}
      lineNumber={line}
      setScrollIndex={setScrollIndex}
      wrap={wrap}
    >
      <ProcessedAnsiiRow lineContent={lineContent} />
    </BaseRow>
  ) : null;
});

interface ProcessedAnsiiRowProps {
  lineContent: string;
}
const ProcessedAnsiiRow: React.FC<ProcessedAnsiiRowProps> = ({
  lineContent,
}) => {
  const memoizedLogLine = useMemo(() => {
    const render = linkifyHtml(ansiUp.ansi_to_html(lineContent), {
      validate: {
        url: (value: string) => /^(http)s?:\/\//.test(value),
      },
    });
    return parse(render);
  }, [lineContent]);
  return <span data-cy="ansii-row">{memoizedLogLine}</span>;
};

AnsiiRow.displayName = "AnsiiRow";

export default AnsiiRow;
