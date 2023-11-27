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
      for (let i = 0; i < logLines.length; i++) {
        const section = lineStartMap[i];
        if (section) {
          const arr = Array.from(
            { length: (section[section.length - 1]?.lineEnd || i) - i },
            (_, k: number) => k + i
          );
          processedLines.push({
            line: arr,
            type: "section",
            commands: section,
          });
          i += arr.length;
        } else {
          processedLines.push({ line: i });
        }
      }
      return processedLines;
    }
    return [];
  }

  const filteredLines: ProcessedLogLines = [];
  logLines.reduce((arr, _logLine, idx) => {
    // Bookmarks, expanded lines, and the share line should always remain uncollapsed.
    if (
      bookmarks.includes(idx) ||
      shareLine === idx ||
      isExpanded(idx, expandedLines)
    ) {
      arr.push({ line: idx });
      return arr;
    }

    // If the line matches the filters, it should remain uncollapsed.
    if (matchingLines.has(idx)) {
      arr.push({ line: idx });
      return arr;
    }

    // Collapse or omit row
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
