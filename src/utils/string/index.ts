/**
 * `copyToClipboard` copies text to a user's clipboard.
 * @param textToCopy - text to be copied
 */
export const copyToClipboard = (textToCopy: string) => {
  navigator.clipboard.writeText(textToCopy);
};

/**
 * `getJiraFormat` uses the applied bookmarks to construct a JIRA formatted string.
 * @param bookmarks  - array of numbers representing the applied bookmarks
 * @param getLine - function that retrieves the log text associated with a log line number
 * @returns formatted string that can be pasted into JIRA
 */
export const getJiraFormat = (
  bookmarks: number[],
  getLine: (lineNumber: number) => string | undefined
) => {
  if (bookmarks.length === 0) {
    return "";
  }

  let jiraString = "{noformat}\n";

  for (let i = 0; i < bookmarks.length; i++) {
    const bookmarkLine = bookmarks[i];
    const logText = getLine(bookmarkLine);

    // If bookmarks is out of bounds, stop processing.
    if (logText === undefined) {
      break;
    }

    jiraString += `${logText}\n`;

    // If the current and next bookmark are not adjacent to each other, insert an
    // ellipsis in between them.
    if (i + 1 !== bookmarks.length && bookmarkLine + 1 !== bookmarks[i + 1]) {
      jiraString += "...\n";
    }
  }
  jiraString += "{noformat}";
  return jiraString;
};
