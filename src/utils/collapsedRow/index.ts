import { ProcessedLogLine } from "types/logs";

/**
 * `isCollapsedRow` determines if a row is a collapsed row. Although it is a simple function, its purpose
 * is to make the code more readable.
 * @param logLine ProcessedLogLine
 * @returns {boolean} true if the row is a collapsed row
 */
const isCollapsedRow = (logLine: ProcessedLogLine): logLine is number[] =>
  Array.isArray(logLine);

export { isCollapsedRow };
