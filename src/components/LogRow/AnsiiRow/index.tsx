import { forwardRef, useMemo } from "react";
import AnsiUp from "ansi_up";
import parse from "html-react-parser";
import linkifyHtml from "linkify-html";
import BaseRow from "components/LogRow/BaseRow";
import { BaseRowProps } from "../types";

const ansiUp = new AnsiUp();

const AnsiiRow = forwardRef<any, BaseRowProps>((rowProps, ref) => {
  const { data, listRowProps } = rowProps;
  const { getLine, wrap, processedLines } = data;
  const { index } = listRowProps;

  const line = processedLines[index];
  // TODO: EVG-17535
  // This should be replaced with a collapsible component
  const lineIndex = Array.isArray(line) ? line[0] : line;
  const lineContent = getLine(lineIndex);
  const memoizedLogLine = useMemo(() => {
    if (!lineContent) return null;
    const render = linkifyHtml(ansiUp.ansi_to_html(lineContent), {
      validate: {
        url: (value: string) => /^(http)s?:\/\//.test(value),
      },
    });
    return parse(render);
  }, [lineContent]);
  if (!lineContent) return null;
  return (
    <BaseRow wrap={wrap} {...listRowProps} ref={ref}>
      <span data-cy="ansii-row">{memoizedLogLine}</span>
    </BaseRow>
  );
});

AnsiiRow.displayName = "AnsiiRow";

export { AnsiiRow };
