import { forwardRef, useMemo } from "react";
import Highlight from "components/Highlight";
import CollapsedRow from "components/LogRow//CollapsedRow";
import BaseRow from "components/LogRow/BaseRow";
import { isCollapsedRow } from "utils/collapsedRow";
import renderHtml from "utils/renderHtml";
import { BaseRowProps } from "../types";
import { isLineInRange } from "../utils";

const ResmokeRow = forwardRef<any, BaseRowProps>((rowProps, ref) => {
  const { data, listRowProps } = rowProps;
  const {
    getLine,
    wrap,
    processedLines,
    range,
    searchTerm,
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
  const lineContent = getLine(line);
  const inRange = isLineInRange(range, line);

  return lineContent ? (
    <BaseRow
      wrap={wrap}
      {...listRowProps}
      ref={ref}
      highlightedLine={highlightedLine}
      lineNumber={line}
      scrollToLine={scrollToLine}
    >
      <ProcessedResmokeRow
        lineContent={lineContent}
        searchTerm={inRange ? searchTerm : undefined}
      />
    </BaseRow>
  ) : null;
});

interface ProcessedResmokeRowProps {
  lineContent: string;
  searchTerm?: RegExp;
}
const ProcessedResmokeRow: React.FC<ProcessedResmokeRowProps> = ({
  lineContent,
  searchTerm,
}) => {
  const memoizedLogLine = useMemo(() => {
    let render = lineContent;
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
  return <span data-cy="resmoke-row">{memoizedLogLine}</span>;
};

ResmokeRow.displayName = "ResmokeRow";

export default ResmokeRow;
