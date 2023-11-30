import { CommandEntry, SectionData } from "hooks/useSections";
import { ExpandedLines, ProcessedLogLines } from "types/logs";
import { isCollapsedRow } from "utils/collapsedRow";
import { isExpanded } from "utils/expandedLines";

type FilterLogsParams = {
  logLines: string[];
  matchingLines: Set<number> | undefined;
  bookmarks: number[];
  shareLine: number | undefined;
  expandedLines: ExpandedLines;
  expandableRows: boolean;
  sectionData: SectionData;
  visibleSectionLines: Set<string>;
};

/**
 * `filterLogs` processes log lines according to what filters, bookmarks, share line, and expanded lines are applied.
 * @param options - an object containing the parameters
 * @param options.logLines - list of strings representing the log lines
 * @param options.matchingLines - set of numbers representing which lines match the applied filters
 * @param options.bookmarks - list of line numbers representing bookmarks
 * @param options.shareLine - a line number representing a share line
 * @param options.expandedLines - an array of intervals representing expanded ranges
 * @param options.expandableRows - specifies if expandable rows is enabled
 * @returns an array of numbers that indicates which log lines should be displayed, and which log lines
 * should be collapsed
 */
const filterLogs = (options: FilterLogsParams): ProcessedLogLines => {
  const {
    bookmarks,
    expandableRows,
    expandedLines,
    logLines,
    matchingLines,
    sectionData,
    shareLine,
    visibleSectionLines,
  } = options;

  const lineStartMap:
    | { [key: number]: Omit<CommandEntry, "status">[] }
    | undefined = sectionData?.reduce((accum, value) => {
    const { lineStart } = value[0];
    return { ...accum, [lineStart]: value };
  }, {});

  // If there are no filters or expandable rows is not enabled, then we don't have to do any
  // processing.
  if (matchingLines === undefined) {
    if (lineStartMap) {
      const processedLines = [] as ProcessedLogLines;
      let sectionEnd;

      for (let lineNumber = 0; lineNumber < logLines.length; lineNumber++) {
        const section = lineStartMap[lineNumber];
        if (section) {
          sectionEnd = section[section.length - 1];
          if (sectionEnd.lineEnd === undefined) {
            throw new Error(
              "Section end line end is undefined.... debug this... lol"
            );
          }
          const arr = Array.from(
            { length: (sectionEnd?.lineEnd || lineNumber) - lineNumber },
            (_, k: number) => k + lineNumber
          );
          processedLines.push({
            commands: section,
            line: arr,
            type: "section",
          });
        }
        if (!sectionEnd) {
          processedLines.push({ line: lineNumber });
        } else if (
          sectionEnd?.lineEnd &&
          ((sectionEnd.lineEnd >= lineNumber &&
            visibleSectionLines.has(sectionEnd.functionName)) ||
            sectionEnd.lineEnd < lineNumber)
        ) {
          processedLines.push({ line: lineNumber });
        }
      }
      return processedLines;
    }
  }

  const filteredLines: ProcessedLogLines = [];
  logLines.reduce((arr, _logLine, idx) => {
    // Render Bookmarks, explicitly expanded lines (expandedLines intervals), and shareLine and any filter matches
    if (
      bookmarks.includes(idx) ||
      shareLine === idx ||
      isExpanded(idx, expandedLines) ||
      matchingLines?.has(idx)
    ) {
      arr.push({ line: idx });
      return arr;
    }

    // Everything else is collapsed
    if (expandableRows) {
      const previousItem = arr[arr.length - 1];
      if (isCollapsedRow(previousItem.line)) {
        (previousItem.line as number[]).push(idx);
      } else {
        arr.push({ line: [idx] });
      }
    }
    return arr;
  }, filteredLines);

  return filteredLines;
};

export default filterLogs;
