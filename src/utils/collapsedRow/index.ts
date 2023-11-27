import { ProcessedLogLine } from "types/logs";

/**
 * `isCollapsedRow` determines if a row is a collapsed row. Although it is a simple function, its purpose
 * is to make the code more readable.
 * @param logLine - the processed log line to check
 * @returns true if the row is a collapsed row
 */
const isCollapsedRow = (logLine: ProcessedLogLine["line"]): Boolean =>
  !!Array.isArray(logLine);

export { isCollapsedRow };
