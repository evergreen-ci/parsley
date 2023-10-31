/**
 * `copyToClipboard` copies text to a user's clipboard.
 * @param textToCopy - text to be copied
 */
export const copyToClipboard = async (textToCopy: string) => {
  await navigator.clipboard.writeText(textToCopy);
};

/**
 * `getJiraFormat` constructs a JIRA formatted string with the lines provided.
 * @param indices  - array of numbers representing the line indices you want to copy
 * @param getLine - function that retrieves the log text associated with a log line number
 * @returns formatted string that can be pasted into JIRA
 */
export const getJiraFormat = (
  indices: number[],
  getLine: (lineNumber: number) => string | undefined
) => {
  if (indices.length === 0) {
    return "";
  }

  let jiraString = "{noformat}\n";

  for (let i = 0; i < indices.length; i++) {
    const indexLine = indices[i];
    const logText = getLine(indexLine);

    // If indices are out of bounds, stop processing.
    if (logText === undefined) {
      break;
    }

    jiraString += `${logText}\n`;

    // If the current and next indices are not adjacent to each other, insert an
    // ellipsis in between them.
    if (i + 1 !== indices.length && indexLine + 1 !== indices[i + 1]) {
      jiraString += "...\n";
    }
  }
  jiraString += "{noformat}";
  return jiraString;
};

/**
 * `stringIntersection` returns a boolean indicating if two strings have a full overlap
 * @param string1 - First string to compare
 * @param string2 - Second string to compare
 * @returns - Boolean indicating if string1 or string2 fit into the other.
 */
export const stringIntersection = (string1: string, string2: string) =>
  string1.includes(string2) || string2.includes(string1);

/**
 * @param str - A string that represents a githash
 * @returns A shortenend version of the input string.
 */
export const shortenGithash = (str?: string) => str?.substring(0, 7);

/**
 * Function that trims the middle portion of a string. ex: "EvergreenUI" -> "Ev...UI"
 * The resulting length, if trimmed, is maxLength + 1 (due to ellipsis length).
 * @param str - Text to trim
 * @param maxLength - Max length before trimming text
 * @returns The original or trimmed text.
 */
export const trimStringFromMiddle = (str: string, maxLength: number) => {
  const ellipsis = "…";
  const numCharsToRemove = str.length - maxLength;

  // if ellipsis would make the string longer/same, just return original string
  if (numCharsToRemove <= ellipsis.length) {
    return str;
  }

  const midpoint = Math.floor(str.length / 2);
  const frontOffset = Math.floor(numCharsToRemove / 2);
  const backOffset = Math.ceil(numCharsToRemove / 2);
  return (
    str.substring(0, midpoint - frontOffset) +
    ellipsis +
    str.substring(midpoint + backOffset)
  );
};

/**
 * `getBytesAsString` returns a string representation of the bytes
 * @param bytes - the number of bytes
 * @param decimals - the number of decimals to round to
 * @returns - a string representation of the bytes
 * @example getBytesAsString(1024) // "1 KB"
 * @example getBytesAsString(1024*1024, 0) // "1 MB"
 * @example getBytesAsString(1024*1024*1024, 0) // "1 GB"
 */
export const getBytesAsString = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  if (bytes === 1) return "1 Byte";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
};

/**
 * `trimLogLineToMaxSize` trims a line to the max size limit
 * @param line - the line to trim
 * @param maxSize - the max line size limit
 * @returns the trimmed line
 */
export const trimLogLineToMaxSize = (line: string, maxSize: number) => {
  if (line.length > maxSize) {
    return `${line.substring(0, maxSize)}…`;
  }
  return line;
};
